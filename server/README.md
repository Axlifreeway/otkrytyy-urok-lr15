# Как перезалить лабы на сервер

На сервере:
- `/var/www/labs/` — `lr13-3d/`, `lr14-3d/`, `teacher/`, `mvp/vendor/pglite/` (их отдаёт nginx);
- `/opt/labsrv/labsrv.py` — сервис: вход студентов, сохранение прогресса, события для панели (база `labs.db` рядом).

## 1. С компьютера (PowerShell)
    scp -r D:\GIT\otkrytyy-urok-lr15\lr13-3d D:\GIT\otkrytyy-urok-lr15\lr14-3d D:\GIT\otkrytyy-urok-lr15\teacher user@адрес:/var/www/labs/
    scp D:\GIT\otkrytyy-urok-lr15\server\labsrv.py D:\GIT\otkrytyy-urok-lr15\server\labsrv.service user@адрес:/tmp/

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

## Чтобы студенты могли работать из дома
Правила 80 и 443 в роутере должны оставаться включёнными, а сервер — работать.

Демо-режим для показа: на экране входа «Преподаватель» → код `boeing747` (меняется в `src/main.js`, константа TEACHER_CODE, затем пересборка).
