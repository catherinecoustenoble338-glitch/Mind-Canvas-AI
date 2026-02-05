#!/bin/bash
set -euo pipefail

# ═══════════════════════════════════════════════════════════════
# OctoFlow Deploy Script — Ubuntu 22.04 (Hostkey.ru VPS)
# One-command deployment: curl -sL <url> | bash
# ═══════════════════════════════════════════════════════════════

APP_NAME="octoflow"
APP_DIR="/opt/$APP_NAME"
APP_PORT=5000
DB_NAME="octoflow"
DB_USER="octoflow"
DB_PASS="$(openssl rand -base64 24 | tr -d '/+=' | head -c 20)"
SESSION_SECRET="$(openssl rand -base64 32)"
REPO_URL="https://github.com/catherinecoustenoble338-glitch/Mind-Canvas-AI.git"
BRANCH="claude/octoflow-product-planner-P0XX8"

echo "══════════════════════════════════════════"
echo "  OctoFlow Deploy — Ubuntu 22.04"
echo "══════════════════════════════════════════"

# ── 1. System packages ──────────────────────────────────────
echo ""
echo "[1/7] Installing system packages..."

apt update -qq
apt install -y -qq curl git build-essential postgresql postgresql-contrib nginx ufw > /dev/null 2>&1

# ── 2. Node.js 20 ──────────────────────────────────────────
echo "[2/7] Installing Node.js 20..."

if ! command -v node &> /dev/null || [[ "$(node -v)" != v20* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
  apt install -y -qq nodejs > /dev/null 2>&1
fi
echo "  Node $(node -v), npm $(npm -v)"

# ── 3. PostgreSQL setup ─────────────────────────────────────
echo "[3/7] Setting up PostgreSQL..."

systemctl enable postgresql > /dev/null 2>&1
systemctl start postgresql

# Create user and database
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"

sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 || \
  sudo -u postgres createdb -O "$DB_USER" "$DB_NAME"

sudo -u postgres psql -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASS';" > /dev/null 2>&1
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" > /dev/null 2>&1
sudo -u postgres psql -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO $DB_USER;" > /dev/null 2>&1

DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME"
echo "  Database ready: $DB_NAME"

# ── 4. Clone and build ──────────────────────────────────────
echo "[4/7] Cloning repository and building..."

if [ -d "$APP_DIR" ]; then
  cd "$APP_DIR"
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
  git reset --hard "origin/$BRANCH"
else
  git clone -b "$BRANCH" "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

npm install --production=false --silent 2>&1 | tail -1

# Push schema to database
DATABASE_URL="$DATABASE_URL" npx drizzle-kit push --force 2>&1 | tail -3

# Build for production
npm run build 2>&1 | tail -3
echo "  Build complete"

# ── 5. Environment file ─────────────────────────────────────
echo "[5/7] Creating environment config..."

cat > "$APP_DIR/.env" << ENVEOF
DATABASE_URL=$DATABASE_URL
SESSION_SECRET=$SESSION_SECRET
NODE_ENV=production
PORT=$APP_PORT
ENVEOF

chmod 600 "$APP_DIR/.env"
echo "  .env created"

# ── 6. Systemd service ──────────────────────────────────────
echo "[6/7] Creating systemd service..."

cat > /etc/systemd/system/octoflow.service << SVCEOF
[Unit]
Description=OctoFlow Product Planner
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=$APP_DIR
EnvironmentFile=$APP_DIR/.env
ExecStart=/usr/bin/node $APP_DIR/dist/index.cjs
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SVCEOF

systemctl daemon-reload
systemctl enable octoflow > /dev/null 2>&1
systemctl restart octoflow
echo "  Service started"

# ── 7. Nginx reverse proxy ──────────────────────────────────
echo "[7/7] Configuring nginx..."

# Get server IP
SERVER_IP=$(hostname -I | awk '{print $1}')

cat > /etc/nginx/sites-available/octoflow << NGXEOF
server {
    listen 80;
    server_name $SERVER_IP;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGXEOF

ln -sf /etc/nginx/sites-available/octoflow /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default 2>/dev/null

nginx -t > /dev/null 2>&1
systemctl enable nginx > /dev/null 2>&1
systemctl restart nginx

# Firewall (keep existing rules, add HTTP)
ufw allow 80/tcp comment 'OctoFlow HTTP' > /dev/null 2>&1
ufw --force enable > /dev/null 2>&1

echo ""
echo "══════════════════════════════════════════"
echo "  OctoFlow deployed successfully!"
echo "══════════════════════════════════════════"
echo ""
echo "  URL:      http://$SERVER_IP"
echo "  Status:   systemctl status octoflow"
echo "  Logs:     journalctl -u octoflow -f"
echo ""
echo "  Database: $DB_NAME"
echo "  DB User:  $DB_USER"
echo "  DB Pass:  $DB_PASS"
echo ""
echo "  Config:   $APP_DIR/.env"
echo ""
echo "  Open http://$SERVER_IP in your browser!"
echo "══════════════════════════════════════════"
