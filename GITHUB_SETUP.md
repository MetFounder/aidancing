# 📦 Hướng Dẫn Tạo GitHub Repository

## 🎯 BƯỚC 1: Tạo Repository trên GitHub

### 1.1. Đăng nhập GitHub

1. Mở browser: https://github.com
2. Đăng nhập (hoặc đăng ký nếu chưa có)

### 1.2. Tạo Repository Mới

1. Click nút **"+"** (góc phải trên) → Chọn **"New repository"**
   - Hoặc vào: https://github.com/new

2. Điền thông tin:
   - **Repository name:** `aidancing` (hoặc tên khác bạn muốn)
   - **Description:** (optional) "AI Dancing MVP - Motion Control"
   - **Visibility:** 
     - ✅ **Public** (mọi người thấy được)
     - Hoặc **Private** (chỉ bạn thấy)
   - ⚠️ **KHÔNG** check "Add a README file"
   - ⚠️ **KHÔNG** check "Add .gitignore"
   - ⚠️ **KHÔNG** check "Choose a license"

3. Click **"Create repository"**

### 1.3. Lấy Repository URL

Sau khi tạo xong, GitHub sẽ hiển thị trang với URL:

**URL sẽ có dạng:**
```
https://github.com/YOUR_USERNAME/aidancing.git
```

**Ví dụ:**
- Nếu username là `john`: `https://github.com/john/aidancing.git`
- Nếu username là `johndoe`: `https://github.com/johndoe/aidancing.git`

**Copy URL này!**

---

## 🚀 BƯỚC 2: Nhập URL vào PowerShell

### 2.1. Quay lại PowerShell

Bạn đang ở dòng:
```
Enter GitHub repository URL (example: https://github.com/username/repo.git):
```

### 2.2. Nhập URL

**Paste URL bạn vừa copy:**
```
https://github.com/YOUR_USERNAME/aidancing.git
```

**Ví dụ:**
```
https://github.com/john/aidancing.git
```

**Nhấn Enter**

---

## ✅ BƯỚC 3: Script Tiếp Tục

Sau khi nhập URL, script sẽ:
1. ✅ Thêm remote repository
2. ✅ Add tất cả files
3. ✅ Commit changes
4. ✅ Push lên GitHub

**Bạn sẽ thấy:**
```
Remote added: https://github.com/YOUR_USERNAME/aidancing.git
Adding files...
Committing changes...
Enter commit message (or press Enter for default):
```

**Nhấn Enter** để dùng default message, hoặc nhập message riêng.

---

## 🔐 BƯỚC 4: GitHub Authentication

Lần đầu push sẽ hỏi credentials:

### Option A: Dùng Personal Access Token (Khuyến nghị)

1. **Tạo Token:**
   - Vào: https://github.com/settings/tokens
   - Click **"Generate new token"** → **"Generate new token (classic)"**
   - **Note:** `AIdancing Deploy`
   - **Expiration:** 90 days (hoặc No expiration)
   - **Scopes:** Check `repo` (full control)
   - Click **"Generate token"**
   - **Copy token ngay!** (chỉ hiện 1 lần)

2. **Khi push hỏi credentials:**
   - **Username:** GitHub username của bạn
   - **Password:** Paste Personal Access Token (KHÔNG phải password!)

### Option B: Dùng GitHub CLI (Nếu đã cài)

```powershell
gh auth login
```

---

## 🐛 NẾU GẶP LỖI

### **Lỗi: Authentication failed**

**Nguyên nhân:**
- Dùng password thay vì token
- Token hết hạn
- Token không có quyền `repo`

**Fix:**
- Tạo token mới với quyền `repo`
- Dùng token thay vì password

### **Lỗi: Repository not found**

**Nguyên nhân:**
- URL sai
- Repository không tồn tại
- Không có quyền access

**Fix:**
- Check URL đúng chưa
- Check repository đã tạo chưa
- Check repository là Public hoặc bạn có quyền

### **Lỗi: Permission denied**

**Nguyên nhân:**
- Token không có quyền
- Repository là private và token không có quyền

**Fix:**
- Tạo token mới với quyền `repo` (full control)

---

## ✅ CHECKLIST

- [ ] Đã đăng nhập GitHub
- [ ] Đã tạo repository mới
- [ ] Đã copy repository URL
- [ ] Đã nhập URL vào PowerShell
- [ ] Đã tạo Personal Access Token (nếu cần)
- [ ] Đã push code thành công

---

## 📝 VÍ DỤ ĐẦY ĐỦ

**Trong PowerShell:**
```
Enter GitHub repository URL (example: https://github.com/username/repo.git):
https://github.com/john/aidancing.git
```

**Script tiếp tục:**
```
Remote added: https://github.com/john/aidancing.git
Adding files...
Committing changes...
Enter commit message (or press Enter for default):
[Enter]
Pushing to GitHub...
Username for 'https://github.com': john
Password for 'https://john@github.com': ghp_xxxxxxxxxxxxx (token)
```

**Kết quả:**
```
SUCCESS: Code pushed to GitHub!
```

---

## 🎉 DONE!

Sau khi push thành công:
- ✅ Code đã trên GitHub
- ✅ Có thể xem tại: `https://github.com/YOUR_USERNAME/aidancing`
- ✅ Tiếp tục deploy lên Railway!

