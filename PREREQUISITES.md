# Prerequisites & Painless Setup Guide for Linux & Zorin OS

> **Goal:** Get blazing-fast file search running on Zorin OS or Ubuntu in under 60 seconds—even on locked, non-admin accounts.  
> **Attribution:** Co-inspired by rkirchin / Gemini  
> **GitHub Repository:** [https://github.com/rpkirchin-creator/Zorin-Linux-FileFinder.git](https://github.com/rpkirchin-creator/Zorin-Linux-FileFinder.git)  

---

## 🚀 Option 1: The "Painless 30-Second Setup" (Zero Sudo Required)

If your students are on school laptops, corporate PCs, or accounts **without admin/root passwords**, this single command will set up everything into their user directory (`~/.local/bin`):

### The 1-Line Universal Installer Script
Copy and paste this into the terminal and press Enter:

```bash
mkdir -p ~/.local/bin ~/.fzf

# 1. Download 'fd' (10x faster find)
curl -sL https://github.com/sharkdp/fd/releases/latest/download/fd-v10.2.0-x86_64-unknown-linux-musl.tar.gz | tar -xz --strip-components=1 -C ~/.local/bin/ fd-v10.2.0-x86_64-unknown-linux-musl/fd

# 2. Download 'ripgrep' (world's fastest text searcher)
curl -sL https://github.com/BurntSushi/ripgrep/releases/latest/download/ripgrep-14.1.1-x86_64-unknown-linux-musl.tar.gz | tar -xz --strip-components=1 -C ~/.local/bin/ ripgrep-14.1.1-x86_64-unknown-linux-musl/rg

# 3. Download 'FSearch' (Instant GUI search like Everything on Windows)
curl -sL https://github.com/cboxdoerfer/fsearch/releases/latest/download/FSearch-x86_64.AppImage -o ~/.local/bin/fsearch

# 4. Make them executable
chmod +x ~/.local/bin/fd ~/.local/bin/rg ~/.local/bin/fsearch

# 5. Ensure ~/.local/bin is permanently in PATH
grep -q '.local/bin' ~/.bashrc || echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

echo "✅ All tools installed successfully into ~/.local/bin!"
```

### Next: Install `fzf` Interactive Fuzzy Finder (Zero Sudo)
```bash
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install --all
source ~/.bashrc
```

**That's it!** No administrator password was asked, and no system files were modified.

---

## 📦 System Dependencies & Verifications

The painless installer relies on standard user tools that come pre-installed on 99% of Zorin OS and Ubuntu installations.

### 1. Check If You Have the Basic Tools:
Run these in your terminal to verify:
```bash
curl --version   # Downloads files
tar --version    # Extracts compressed tarballs
git --version    # Clones fzf (optional)
```

If `curl` is missing on an admin machine:
```bash
sudo apt update && sudo apt install curl -y
```

If you do NOT have sudo and `curl` is missing, you can use `wget`:
```bash
wget -qO- https://github.com/sharkdp/fd/releases/latest/download/fd-v10.2.0-x86_64-unknown-linux-musl.tar.gz | tar -xz --strip-components=1 -C ~/.local/bin/ fd-v10.2.0-x86_64-unknown-linux-musl/fd
```

---

## 🛠️ Option 2: Standard System-Wide Installation (If You Have Sudo)

If you own your machine and have administrator (`sudo`) access:

```bash
# 1. Update package database
sudo apt update

# 2. Install fd-find, fzf, and ripgrep from official repositories
sudo apt install -y fd-find fzf ripgrep

# IMPORTANT NOTE FOR UBUNTU / ZORIN OS:
# Ubuntu names the fd binary 'fdfind' due to a legacy package conflict.
# Run this once to create the standard 'fd' alias:
echo 'alias fd="fdfind"' >> ~/.bashrc
source ~/.bashrc
```

### Install FSearch (GUI) via PPA or Flatpak:
```bash
# Via Official Stable PPA:
sudo add-apt-repository -y ppa:christian-boxdoerfer/fsearch-stable
sudo apt update
sudo apt install -y fsearch

# OR via Flatpak (Zorin Software Center):
flatpak install flathub io.github.cboxdoerfer.FSearch -y
```

---

## ⌨️ Effortless Desktop Hotkey Setup in Zorin OS

Make FSearch open in **0.1 seconds** whenever you need to find a file:

1. Press the **Super** key (Windows key) on your keyboard.
2. Open **Settings** &rarr; **Keyboard**.
3. Scroll to **View and Customize Shortcuts** &rarr; click **Custom Shortcuts**.
4. Click **+** (Add Shortcut):
   - **Name:** `Fast File Finder`
   - **Command:** `fsearch` (or `/home/<your-username>/.local/bin/fsearch`)
   - **Shortcut:** `Super + F` or `Ctrl + Space`
5. Click **Add**.

Now, whenever you press `Super + F`, an instant search bar appears on your screen!

---

## 🧪 10-Second Verification Test

Verify that your installation is working:

```bash
# Test 1: Check fd version
fd --version
# Expected: fd 10.2.0

# Test 2: Check ripgrep version
rg --version
# Expected: ripgrep 14.1.1

# Test 3: Test an instant search for .txt files
fd -e txt . ~

# Test 4: Launch FSearch GUI
fsearch &
```

---

## 💡 Troubleshooting Cheat-Sheet

| Issue | Cause | Fix |
| :--- | :--- | :--- |
| `fd: command not found` | `~/.local/bin` is not in your current shell's PATH | Run: `source ~/.bashrc` or restart the terminal. |
| `fdfind` works but `fd` doesn't | You installed via `apt` on Ubuntu | Run: `echo 'alias fd="fdfind"' >> ~/.bashrc && source ~/.bashrc` |
| Flooded with `Permission denied` | Searching root (`/`) without root access | Append `2>/dev/null` to your command, or use `fd` instead of `find`. |
| FSearch won't launch | AppImage needs execute permission | Run: `chmod +x ~/.local/bin/fsearch` |
