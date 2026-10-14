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
В роутере (NAT → Port Mapping) добавить правило TCP 443 → сервер:443, правило для 80 оставить. Затем:

    sudo apt install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d labs.твойдомен.ru     # на вопрос про redirect — перенаправлять на HTTPS
    sudo ufw allow 443/tcp

## 5. Группы
`https://labs.твойдомен.ru/teacher/` → ключ → «Группы и списки» → название группы и список «Фамилия Имя» по строке → «Сохранить список».
Порядок строк задаёт варианты. Список можно поправить позже: PIN и прогресс оставшихся студентов сохранятся.
Студент: выбирает группу, себя, при первом входе придумывает PIN из 4 цифр. Дома — тот же сайт, та же группа, тот же PIN.
Забыл PIN — в «Группы и списки» кнопка «сбросить», студент задаст новый.

Пока есть хоть одна группа, сервер принимает события только от вошедших студентов: ФИО, группу и вариант
он берёт из своей базы, а не со страницы, — подделать чужую работу в панели нельзя.
Панель можно открыть ссылкой `…/teacher/?key=ключ`: ключ запомнится в браузере и сразу уберётся из адресной строки.

## Чтобы студенты могли работать из дома
Правила 80 и 443 в роутере должны оставаться включёнными, а сервер — работать.

## Демо-режим для показа
На экране входа «Преподаватель» → код преподавателя → «Демо»: все уровни открыты, есть кнопка «Решение».
Без сервера то же самое — ввести код вместо номера в журнале (`код 12` — вариант 12).
В коде страницы хранится только хэш кода. Сменить код:

    node tools/teacher-hash.mjs новый-код     # → вставить в TEACHER_HASH в common/teacher.js
    npm run build
