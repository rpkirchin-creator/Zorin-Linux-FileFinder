#!/bin/bash
set -e

echo "=========================================="
echo "Starting Student Tutorial Environment Setup"
echo "Created by rkirchin-creator / Gemini      "
echo "=========================================="

# 1. Ensure local bin exists and is in PATH
mkdir -p "$HOME/.local/bin"
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
    export PATH="$HOME/.local/bin:$PATH"
fi

# 2. Install ripgrep (statically linked musl binary)
echo "[1/6] Downloading ripgrep..."
curl -sL --retry 3 --retry-connrefused --connect-timeout 15 \
  "https://github.com/BurntSushi/ripgrep/releases/download/14.1.1/ripgrep-14.1.1-x86_64-unknown-linux-musl.tar.gz" \
  | tar -xz -C /tmp --wildcards '*/rg' --strip-components=1 2>/dev/null || true

if [ -f /tmp/rg ]; then
    mv /tmp/rg "$HOME/.local/bin/rg"
    chmod +x "$HOME/.local/bin/rg"
fi

# 3. Install fd (statically linked musl binary)
echo "[2/6] Downloading fd..."
curl -sL --retry 3 --retry-connrefused --connect-timeout 15 \
  "https://github.com/sharkdp/fd/releases/download/v10.5.0/fd-v10.5.0-x86_64-unknown-linux-musl.tar.gz" \
  | tar -xz -C /tmp --wildcards '*/fd' --strip-components=1 2>/dev/null || true

if [ -f /tmp/fd ]; then
    mv /tmp/fd "$HOME/.local/bin/fd"
    chmod +x "$HOME/.local/bin/fd"
fi

# 4. Install fzf (fuzzy finder binary)
echo "[3/6] Downloading fzf..."
curl -sL --retry 3 --retry-connrefused --connect-timeout 15 \
  "https://github.com/junegunn/fzf/releases/download/v0.56.3/fzf-0.56.3-linux_amd64.tar.gz" \
  | tar -xz -C /tmp 2>/dev/null || true

if [ -f /tmp/fzf ]; then
    mv /tmp/fzf "$HOME/.local/bin/fzf"
    chmod +x "$HOME/.local/bin/fzf"
fi

# 5. Install FSearch via user-space Flatpak (non-interactive, no sudo prompts)
if command -v flatpak &> /dev/null; then
    echo "[4/6] Installing FSearch..."
    flatpak remote-add --user --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo >/dev/null 2>&1 || true
    flatpak install --user --noninteractive flathub io.github.cboxdoerfer.FSearch >/dev/null 2>&1 || true
fi

# 6. Download/Clone your application files to a dedicated folder
echo "[5/6] Downloading application files..."
APP_DIR="$HOME/student-tutorial-app"

if ! command -v git &> /dev/null; then
    sudo apt update && sudo apt install git -y
fi

if [ -d "$APP_DIR/.git" ]; then
    echo "Updating existing application files..."
    cd "$APP_DIR" && git pull
else
    echo "Cloning tutorial repository..."
    # REPLACE with your actual GitHub repository URL
    git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git "$APP_DIR"
fi

# 7. Create the application runner wrapper for Node/Vite
echo "[6/6] Configuring application launcher and desktop shortcut..."
LAUNCHER="$HOME/.local/bin/run-student-app"

cat << EOF > "$LAUNCHER"
#!/bin/bash
echo "Launching Student Tutorial Application..."
cd "$APP_DIR"

# Install npm packages if node_modules doesn't exist yet
if [ ! -d "node_modules" ]; then
    echo "Installing project dependencies (first run)..."
    npm install
fi

# Optionally auto-open the browser after a brief delay once Vite boots up
# NEW:
(sleep 2 && xdg-open http://localhost:3000 2>/dev/null) &

# Start the Vite development server
npm run dev

echo ""
read -p "App closed. Press Enter to exit..."
EOF
chmod +x "$LAUNCHER"

# 8. Create the Desktop Shortcut
DESKTOP_DIR="$HOME/Desktop"
mkdir -p "$DESKTOP_DIR"
DESKTOP_FILE="$DESKTOP_DIR/Student-Tutorial.desktop"

cat << EOF > "$DESKTOP_FILE"
[Desktop Entry]
Name=Student Tutorial App
Comment=Launch the interactive React tutorial application
Exec=$LAUNCHER
Terminal=true
Type=Application
Icon=utilities-terminal
Categories=Education;Development;
EOF

chmod +x "$DESKTOP_FILE"
gio set "$DESKTOP_FILE" metadata::trusted true 2>/dev/null || true

echo "=========================================="
echo "Setup complete! All files are in \$HOME/student-tutorial-app"
echo "=========================================="
