# 📸 Media Storage Guide for Production

## Current Setup (Development)

### Storage Location
```
/backend/public/uploads/
├── {userId}_{type}_{timestamp}.{ext}  # General uploads
├── reviews/
│   └── {timestamp}-{random}.{ext}     # Review media
├── services/
│   └── {userId}_{timestamp}.{ext}     # Service media
└── products/
    └── {userId}_{timestamp}.{ext}     # Product media
```

### File URLs
```
http://localhost:4000/uploads/{filename}
```

### Current Limitations
- ❌ Files stored on server disk (limited space)
- ❌ No automatic backups
- ❌ No CDN for fast delivery
- ❌ Scalability issues with high traffic
- ❌ Lost if server crashes/restarts

---

## 🚀 Production Solutions

### Option 1: AWS S3 + CloudFront (Recommended)

**Advantages:**
- ✅ Unlimited storage
- ✅ 99.999999999% durability
- ✅ Global CDN delivery
- ✅ Automatic backups
- ✅ Pay-as-you-go pricing
- ✅ Easy scalability

**Setup Steps:**

1. **Install AWS SDK**
```bash
cd backend
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
```

2. **Configure Environment Variables** (`.env`)
```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=adscode-media
AWS_CLOUDFRONT_URL=https://d1234567890.cloudfront.net  # Optional CDN
```

3. **Use S3UploadService** (Already created at `backend/src/upload/s3-upload.service.ts`)

4. **Update UploadService** to use S3 in production:
```typescript
// In upload.service.ts
constructor(
  private s3UploadService: S3UploadService,
  private configService: ConfigService
) {}

async uploadMedia(userId: string, file: Express.Multer.File, type: string) {
  // Use S3 in production, local storage in development
  if (this.configService.get('NODE_ENV') === 'production') {
    return this.s3UploadService.uploadToS3(file, 'uploads', userId, type);
  } else {
    return this.uploadLocalFile(file, userId, type);
  }
}
```

**Cost Estimate:**
- Storage: ~$0.023/GB/month
- Transfer: ~$0.09/GB
- Example: 10GB storage + 100GB transfer = ~$9.23/month

---

### Option 2: Cloudflare R2 (Cost-Effective)

**Advantages:**
- ✅ Zero egress fees (free bandwidth)
- ✅ S3-compatible API
- ✅ Cheaper than AWS S3
- ✅ Built-in CDN

**Setup:**
```bash
npm install @aws-sdk/client-s3  # R2 is S3-compatible
```

**Environment Variables:**
```env
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=adscode-media
R2_PUBLIC_URL=https://pub-xxxx.r2.dev
```

**Cost:** ~$0.015/GB/month (storage only, no egress fees!)

---

### Option 3: DigitalOcean Spaces

**Advantages:**
- ✅ Predictable pricing
- ✅ Built-in CDN
- ✅ S3-compatible API
- ✅ Simple setup

**Cost:** $5/month for 250GB storage + 1TB transfer

---

### Option 4: Self-Hosted with Nginx (Budget Option)

**Setup Steps:**

1. **Dedicated Media Server** or **NFS Mount**
```bash
# Mount external volume for media
sudo mkdir /mnt/media
sudo mount /dev/sdb1 /mnt/media
```

2. **Update Backend to Save to Mount**
```typescript
const uploadsDir = path.join('/mnt/media', 'uploads');
```

3. **Nginx Configuration** for Static Files
```nginx
server {
  listen 80;
  server_name media.adscode.com;

  location /uploads {
    alias /mnt/media/uploads;
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

4. **Backup Strategy**
```bash
# Cron job for daily backups
0 2 * * * rsync -av /mnt/media/ user@backup-server:/backups/media/
```

**Advantages:**
- ✅ Full control
- ✅ No API fees
- ✅ One-time cost

**Disadvantages:**
- ❌ Manual backups needed
- ❌ No built-in CDN
- ❌ Limited scalability
- ❌ Server management overhead

---

## 📊 Recommendation Summary

| Solution | Best For | Monthly Cost | Complexity |
|----------|----------|--------------|------------|
| **AWS S3 + CloudFront** | Production apps, high traffic | ~$10-50 | Medium |
| **Cloudflare R2** | Cost-conscious, high bandwidth | ~$5-15 | Medium |
| **DigitalOcean Spaces** | Predictable costs, simple setup | $5-10 | Low |
| **Self-Hosted** | Budget constraint, low traffic | $0 (server only) | High |

---

## 🎯 Recommended Implementation Path

### Phase 1: Immediate (Development)
- ✅ Current local storage is fine
- ✅ Files in `backend/public/uploads/`

### Phase 2: Pre-Production
```bash
# Install AWS SDK
cd backend
npm install @aws-sdk/client-s3

# Add to backend/src/upload/upload.module.ts
import { S3UploadService } from './s3-upload.service';

@Module({
  providers: [UploadService, S3UploadService],
  // ...
})
```

### Phase 3: Production Deploy
1. Create S3 bucket or R2 bucket
2. Add environment variables
3. Enable production mode
4. Test upload flow
5. Migrate existing files (optional)

---

## 🔧 Migration Script (Local to S3)

```typescript
// migrate-to-s3.ts
import * as fs from 'fs';
import * as path from 'path';
import { S3UploadService } from './s3-upload.service';

async function migrateFiles() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const files = fs.readdirSync(uploadsDir);
  
  for (const filename of files) {
    const filePath = path.join(uploadsDir, filename);
    const fileBuffer = fs.readFileSync(filePath);
    const file = {
      buffer: fileBuffer,
      originalname: filename,
      mimetype: getMimeType(filename),
      size: fs.statSync(filePath).size,
    } as Express.Multer.File;
    
    // Upload to S3
    await s3Service.uploadToS3(file, 'uploads', 'migration', 'image');
    console.log(`Migrated: ${filename}`);
  }
}
```

---

## 🛡️ Security Best Practices

1. **File Validation**
   - ✅ Already implemented: MIME type checks
   - ✅ Already implemented: File size limits
   - ✅ Add: Virus scanning (ClamAV)

2. **Access Control**
   - Set proper S3 bucket policies
   - Use signed URLs for private files
   - Enable CORS for frontend access

3. **CDN Configuration**
   - Cache static assets (1 year)
   - Enable compression
   - Use HTTPS only

---

## 💡 Quick Start for Production

```bash
# 1. Install dependencies
cd backend
npm install @aws-sdk/client-s3

# 2. Set environment variables
cat >> .env.production << EOF
NODE_ENV=production
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=adscode-media
EOF

# 3. Deploy!
npm run build
npm run start:prod
```

Your media will now be stored in S3 instead of local disk! 🎉
