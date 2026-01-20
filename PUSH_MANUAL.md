# 🔐 Hướng Dẫn Push Manual (Fix Credentials)

## ❌ Vấn Đề

Lỗi: `Permission denied to Biggiezz` nhưng repo là `MetFounder/aidancing`

**Nguyên nhân:** Git đang dùng credentials của account khác.

---

## ✅ CÁCH FIX

### **Bước 1: Clear Cached Credentials**

**Mở PowerShell và chạy:**

```powershell
cd D:\AIdancing

# Clear Windows Credential Manager
cmdkey /list | Select-String "git:https://github.com" | ForEach-Object { cmdkey /delete:$_ }

# Hoặc clear tất cả GitHub credentials
cmdkey /list | Select-String "github" | ForEach-Object { cmdkey /delete:$_ }
```

**Hoặc dùng Git Credential Manager:**

```powershell
git credential-manager-core erase
# Nhập: https://github.com
# Nhấn Enter 2 lần
```

---

### **Bước 2: Push Lại với Credentials Đúng**

**Chạy:**

```powershell
cd D:\AIdancing
git push -u origin main
```

**Khi hỏi credentials:**

1. **Username:** `MetFounder`
2. **Password:** **Personal Access Token** (KHÔNG phải password!)

---

### **Bước 3: Tạo Personal Access Token (Nếu chưa có)**

1. Vào: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Điền:
   - **Note:** `AIdancing Deploy`
   - **Expiration:** 90 days (hoặc No expiration)
   - **Scopes:** Check `repo` (full control)
4. Click **"Generate token"**
5. **Copy token ngay!** (chỉ hiện 1 lần)
6. Token bắt đầu bằng: `ghp_xxxxxxxxxxxxx`

---

### **Bước 4: Nhập Credentials**

**Khi push hỏi:**

```
Username for 'https://github.com': MetFounder
Password for 'https://MetFounder@github.com': ghp_xxxxxxxxxxxxx (paste token)
```

**Nhấn Enter** → Push thành công!

---

## 🔄 ALTERNATIVE: Dùng SSH (Nếu HTTPS không được)

### **Setup SSH Key:**

```powershell
# Generate SSH key (nếu chưa có)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub
```

### **Add SSH Key vào GitHub:**

1. Vào: https://github.com/settings/keys
2. Click **"New SSH key"**
3. Paste public key
4. Save

### **Đổi Remote sang SSH:**

```powershell
cd D:\AIdancing
git remote set-url origin git@github.com:MetFounder/aidancing.git
git push -u origin main
```

---

## ✅ CHECKLIST

- [ ] Đã clear cached credentials
- [ ] Đã tạo Personal Access Token
- [ ] Đã push với credentials đúng
- [ ] Code đã trên GitHub

---

## 🎉 DONE!

Sau khi push thành công:
- ✅ Code đã trên GitHub: https://github.com/MetFounder/aidancing
- ✅ Tiếp tục deploy lên Railway!

