#!/bin/sh
# Автообновление сервера из GitHub: запускается таймером раз в минуту (labs-deploy.timer).
# Если в ветке main появились новые коммиты — копирует лабы в /var/www/labs и, если менялся сервер, перезапускает labsrv.
# Выкладывается только main: сливайте туда pull request после зелёных проверок (GitHub Actions).
set -eu
SRC=${LABS_SRC:-/opt/labs-src}            # клон репозитория (git clone … /opt/labs-src)
WWW=${LABS_WWW:-/var/www/labs}
BRANCH=${LABS_BRANCH:-main}
PARTS="lr13-3d lr14-3d labs teacher common vendor"
DB=${LABS_DB:-/opt/labsrv/labs.db}
BAK=${LABS_BAK:-/opt/labsrv/backups}
KEEP=${LABS_KEEP:-30}

# копия базы (PIN, прогресс, журнал, отчёты): средствами SQLite, на ходу, без остановки сервера
backup() {
  [ -f "$DB" ] || return 0
  mkdir -p "$BAK"
  python3 -c 'import sqlite3, sys; d = sqlite3.connect(sys.argv[2]); sqlite3.connect(sys.argv[1]).backup(d); d.close()' \
    "$DB" "$BAK/labs-$(date +%Y%m%d-%H%M%S)$1.db"
  ls -1t "$BAK"/labs-*.db | tail -n +$((KEEP + 1)) | xargs -r rm -f       # хранить последние KEEP копий
}
# раз в сутки — обязательно, даже если обновлений нет
ls "$BAK"/labs-"$(date +%Y%m%d)"-*.db >/dev/null 2>&1 || backup ""

cd "$SRC"
git fetch -q origin "$BRANCH"
NEW=$(git rev-parse "origin/$BRANCH")
# FORCE=1 — выложить текущую версию, даже если нового нет (первый запуск сразу после git clone)
[ "${FORCE:-}" != 1 ] && [ "$(git rev-parse HEAD)" = "$NEW" ] && exit 0      # нового нет

OLD=$(git rev-parse HEAD)
git reset -q --hard "$NEW"
# каждую папку — копией рядом и подменой одним переименованием: студенты не увидят полувыложенную лабу
for d in $PARTS; do
  rm -rf "$WWW/.$d.new" "$WWW/.$d.old"
  cp -r "$d" "$WWW/.$d.new"
  rm -rf "$WWW/.$d.new/src" "$WWW/.$d.new/README.md"
  [ -e "$WWW/$d" ] && mv "$WWW/$d" "$WWW/.$d.old"
  mv "$WWW/.$d.new" "$WWW/$d"
  rm -rf "$WWW/.$d.old"
done
cp index.html "$WWW/.index.html.new" && mv "$WWW/.index.html.new" "$WWW/index.html"
if [ "${FORCE:-}" = 1 ] || ! git diff --quiet "$OLD" "$NEW" -- server/labsrv.py; then
  backup "-before-$(git rev-parse --short "$NEW")"      # перед новой версией сервера — копия базы
  cp server/labsrv.py /opt/labsrv/labsrv.py
  systemctl restart labsrv
fi
logger -t labs-deploy "выложено $(git log -1 --format='%h %s')"
