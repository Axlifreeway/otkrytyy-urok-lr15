# Как перезалить лабы на сервер

На сервере:
- `/var/www/labs/` — главная `index.html`, `lr13-3d/`, `lr14-3d/`, `labs/`, `teacher/`, `common/`, `vendor/` (их отдаёт nginx).
  `common/` нужен из-за общих стилей 3D-лаб (`common/lab3d.css`), `vendor/` — PostgreSQL в браузере (PGlite);
- `/opt/labsrv/labsrv.py` — сервис: вход студентов, сохранение прогресса, события для панели (база `labs.db` рядом).

Перед заливкой соберите 3D-лабы и прогоните тесты (из корня репозитория):

    npm install
    npm run build      # lr13-3d/game.js, lr14-3d/game.js
    npm test           # данные вариантов, разбор команд, сервер
    npm run e2e        # все уровни в браузере (нужен Chromium для Playwright)

## 1. С компьютера (PowerShell)
    cd D:\GIT\otkrytyy-urok-lr15
    scp -r index.html lr13-3d lr14-3d labs teacher common vendor user@адрес:/var/www/labs/

Раньше PGlite лежал в `mvp/vendor/pglite/` — после первой заливки `vendor/` старую папку `/var/www/labs/mvp/vendor` можно удалить.
    scp server\labsrv.py server\labsrv.service user@адрес:/tmp/

## 2. Сервис (на сервере)
Первый раз:

    sudo mkdir -p /opt/labsrv && sudo cp /tmp/labsrv.py /opt/labsrv/ && sudo chown -R www-data /opt/labsrv
    sudo nano /tmp/labsrv.service        # в строке LABS_KEY= впишите свой ключ (пароль панели)
    sudo cp /tmp/labsrv.service /etc/systemd/system/
    sudo systemctl daemon-reload && sudo systemctl enable --now labsrv

Каждое следующее обновление:

    sudo cp /tmp/labsrv.py /opt/labsrv/ && sudo systemctl restart labsrv

Проверка: `curl http://127.0.0.1:8090/api/ping` → `{"ok": true, "auth": true}`.
Важно: не меняйте LABS_KEY после того, как студенты вошли, — их входы с других устройств перестанут работать (придётся войти заново по PIN).

Проверить всё на своём компьютере без nginx (сервер сам раздаёт файлы):

    $env:LABS_KEY = 'тест'; $env:LABS_STATIC = (Get-Location).Path; python server\labsrv.py
    → http://127.0.0.1:8090/lr14-3d/  и  http://127.0.0.1:8090/teacher/?key=тест

## 3. nginx (один раз) — внутрь server { … } сайта labs
    location /api/ {
        proxy_pass http://127.0.0.1:8090;
        proxy_set_header X-Real-IP $remote_addr;
        client_max_body_size 512k;
    }

    sudo nginx -t && sudo systemctl reload nginx

## 4. HTTPS (один раз)
Без HTTPS пароль-ключ панели и PIN студентов идут по сети открытым текстом, а браузеры помечают сайт «Не защищено».

1. **Роутер.** NAT → Port Mapping (Virtual Server): добавьте правило TCP **443** → внутренний адрес сервера, порт 443.
   Правило для 80 оставьте — через него certbot подтверждает домен и продлевает сертификат.
2. **Домен.** `labs.твойдомен.ru` должен указывать на внешний IP роутера (запись A у регистратора).
   Проверка с телефона через мобильный интернет: `http://labs.твойдомен.ru` открывается.
3. **Сертификат** (на сервере):

       sudo apt install -y certbot python3-certbot-nginx
       sudo ufw allow 443/tcp
       sudo certbot --nginx -d labs.твойдомен.ru     # на вопрос про redirect — перенаправлять на HTTPS

   certbot сам допишет в nginx `listen 443 ssl` и пути к сертификату и поставит автопродление.
4. **Проверка:** `https://labs.твойдомен.ru` открывается с замком; `sudo certbot renew --dry-run` проходит без ошибок.

Если не открывается снаружи: провайдер может блокировать входящие 80/443 на «серых» IP — проверьте,
что внешний IP в роутере совпадает с тем, что показывает 2ip.ru; если нет — нужен «белый» IP у провайдера.

## 4а. Автовыкладка из GitHub (один раз)
На каждый push GitHub Actions прогоняет проверки (`.github/workflows/ci.yml`): тесты, сборку, все уровни в браузере.
Сервер раз в минуту смотрит ветку `main` и, если там новое, сам выкладывает лабы (и перезапускает labsrv,
если он менялся). Порядок работы: изменения — в отдельной ветке → pull request → проверки зелёные → слить в `main`.

1. Ключ только для чтения репозитория (на сервере):

       sudo ssh-keygen -t ed25519 -N '' -f /root/.ssh/labs_deploy
       sudo cat /root/.ssh/labs_deploy.pub

   GitHub → репозиторий → Settings → Deploy keys → Add deploy key: вставьте ключ, «Allow write access» **не** отмечать.
2. Клон и таймер:

       sudo GIT_SSH_COMMAND='ssh -i /root/.ssh/labs_deploy -o StrictHostKeyChecking=accept-new' \
         git clone git@github.com:Axlifreeway/otkrytyy-urok-lr15.git /opt/labs-src
       sudo git -C /opt/labs-src config core.sshCommand 'ssh -i /root/.ssh/labs_deploy'
       sudo cp /opt/labs-src/server/labs-deploy.service /opt/labs-src/server/labs-deploy.timer /etc/systemd/system/
       sudo systemctl daemon-reload && sudo systemctl enable --now labs-deploy.timer

3. Проверка: `sudo systemctl start labs-deploy.service && journalctl -t labs-deploy -n 5` — строка «выложено …».
   Что и когда выкладывалось: `journalctl -t labs-deploy`.

Ручная выкладка (раздел 1) после этого не нужна. Откатить: `git revert` неудачного коммита в `main` — через минуту сервер вернётся к рабочей версии.

## 4б. Данные студентов при обновлениях
Вся работа студентов — PIN, прогресс, журнал команд, сданные отчёты — лежит в `/opt/labsrv/labs.db`.
Обновление лаб и сервера её не пересоздаёт:
- схема только дополняется (новые таблицы и столбцы), старые строки не меняются; PIN и выданные токены
  считаются так же, пока не меняется `LABS_KEY` — **ключ не меняйте**, иначе все PIN придётся сбросить;
- перед изменением схемы сервер сам кладёт рядом копию `labs.db.before-<дата-время>`;
- `deploy.sh` раз в сутки и перед каждой новой версией сервера делает копию в `/opt/labsrv/backups/`
  (хранятся последние 30).

Вернуть копию:

    sudo systemctl stop labsrv
    sudo cp /opt/labsrv/backups/labs-ДАТА.db /opt/labsrv/labs.db && sudo rm -f /opt/labsrv/labs.db-wal /opt/labsrv/labs.db-shm
    sudo chown www-data /opt/labsrv/labs.db && sudo systemctl start labsrv

Прогресс студента хранится ещё и в его браузере: при входе сервер и браузер сливаются (пройденное не теряется ни там, ни там).

## 5. Группы
`https://labs.твойдомен.ru/teacher/` → ключ → «Группы и списки» → название группы и список «Фамилия Имя» по строке → «Сохранить список».
Порядок строк задаёт варианты. Список можно поправить позже: PIN и прогресс оставшихся студентов сохранятся.
Студент: выбирает группу, себя, при первом входе придумывает PIN из 4 цифр. Дома — тот же сайт, та же группа, тот же PIN.
Забыл PIN — в «Группы и списки» кнопка «сбросить», студент задаст новый.

Пока есть хоть одна группа, сервер принимает события только от вошедших студентов: ФИО, группу и вариант
он берёт из своей базы, а не со страницы, — подделать чужую работу в панели нельзя.
Панель можно открыть ссылкой `…/teacher/?key=ключ`: ключ запомнится в браузере и сразу уберётся из адресной строки.

В панели:
- **день** — стрелки ◀ ▶, календарь, «Вчера», «Сегодня»; «Новая пара» — только события с этой минуты (сегодня);
- **📄 Отчёты** — протоколы, которые студенты отправили кнопкой «📤 Отправить преподавателю»: открываются прямо
  в панели, есть «Печать / PDF» и прежние версии (студент может исправить ответы и отправить ещё раз).
  Кнопка 📄 есть и в строке студента, и в его журнале;
- **∞ N** у студента — сколько заданий тренировки он решил после уровней (без баллов, на оценку не влияет);
- в журнале студента команды подсвечены как в его пульте: ключевые слова SQL — жёлтым.

## Чтобы студенты могли работать из дома
Правила 80 и 443 в роутере должны оставаться включёнными, а сервер — работать.

## Демо-режим для показа
На экране входа «Преподаватель» → код преподавателя → «Демо»: все уровни открыты, есть кнопка «Решение».
Без сервера то же самое — ввести код вместо номера в журнале (`код 12` — вариант 12).
В коде страницы хранится только хэш кода. Сменить код:

    node tools/teacher-hash.mjs новый-код     # → вставить в TEACHER_HASH в common/teacher.js
    npm run build
