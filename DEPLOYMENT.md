# WasteMap Deployment Guide

## 🚀 Deploying to Vercel (Frontend) + Render (Backend)

### Part 1: Deploy Backend to Render

#### Step 1: Prepare Backend for Deployment

1. **Create `render.yaml` in the `server` folder** (optional, but recommended):
```yaml
services:
  - type: web
    name: wastemap-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5001
```

2. **Update `server/package.json` to ensure start script exists**:
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

#### Step 2: Create Render Account & Deploy

1. Go to [https://render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `wastemap-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

#### Step 3: Set Environment Variables on Render

In the Render dashboard, go to **Environment** tab and add:

```
PORT=5001
NODE_ENV=production
MONGODB_URI=mongodb+srv://wastemap_user:wastemap@cluster0.ytvm3wu.mongodb.net/wastemap
JWT_SECRET=your_super_secret_jwt_key_change_in_production_to_random_string
CLIENT_URL=https://your-vercel-app.vercel.app
```

**Important**: After frontend deployment, come back and update `CLIENT_URL` with your actual Vercel URL!

#### Step 4: Deploy

- Click **"Create Web Service"**
- Wait for deployment (takes 2-5 minutes)
- Note your backend URL: `https://wastemap-backend.onrender.com` (or similar)

---

### Part 2: Deploy Frontend to Vercel

#### Step 1: Update Frontend Configuration

1. **Update `client/.env.production`**:
```env
REACT_APP_API_URL=https://your-render-backend-url.onrender.com
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Replace `your-render-backend-url.onrender.com` with your actual Render backend URL from Part 1, Step 4.

2. **Create `vercel.json` in the `client` folder**:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
        { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" }
      ]
    }
  ]
}
```

#### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI (Recommended)**

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to client folder and deploy:
```bash
cd client
vercel
```

3. Follow prompts:
   - Link to existing project? **No**
   - Project name: `wastemap-client`
   - Directory: `./` (current)
   - Override settings? **No**

4. Deploy to production:
```bash
vercel --prod
```

**Option B: Using Vercel Dashboard**

1. Go to [https://vercel.com](https://vercel.com) and sign up
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   - Click **"Environment Variables"**
   - Add:
     ```
     REACT_APP_API_URL=https://your-render-backend-url.onrender.com
     ```

6. Click **"Deploy"**

#### Step 3: Update Backend CORS

After getting your Vercel URL (e.g., `https://wastemap-client.vercel.app`):

1. Go back to Render dashboard
2. Update `CLIENT_URL` environment variable to your Vercel URL
3. Restart the backend service

---

### Part 3: Post-Deployment Configuration

#### Update Backend CORS (in `server/index.js`)

Make sure your CORS is configured for production:

```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
```

#### Create Admin User in Production

1. Access Render dashboard
2. Go to **Shell** tab
3. Run:
```bash
node createAdmin.js
```

Or use Render's one-off jobs feature.

---

### Part 4: Testing Deployment

1. **Test Backend**:
   - Visit: `https://your-backend.onrender.com/`
   - Should see: `{"message": "WasteMap API is running"...}`

2. **Test Frontend**:
   - Visit: `https://your-app.vercel.app`
   - Try registering a new user
   - Create a pickup request
   - Login as admin: `admin@wastemap.com` / `admin123`

---

## 🔧 Troubleshooting

### CORS Errors
- Ensure `CLIENT_URL` in Render matches your Vercel URL exactly
- Restart Render service after updating environment variables

### 401 Unauthorized
- Check if `REACT_APP_API_URL` in Vercel environment variables is correct
- Redeploy frontend after changing environment variables

### 500 Server Errors
- Check Render logs: Dashboard → Logs tab
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

### Build Failures on Vercel
- Check build logs in Vercel dashboard
- Ensure `client/package.json` has all dependencies
- Try clearing cache and redeploying

---

## 📋 Deployment Checklist

### Before Deploying:
- [ ] Push all code to GitHub
- [ ] Ensure `.env` files are in `.gitignore`
- [ ] Test locally one more time
- [ ] Have MongoDB Atlas connection string ready

### Backend (Render):
- [ ] Create Render account
- [ ] Deploy web service
- [ ] Set all environment variables
- [ ] Note backend URL
- [ ] Test API endpoint

### Frontend (Vercel):
- [ ] Update `.env.production` with Render backend URL
- [ ] Create `vercel.json`
- [ ] Deploy to Vercel
- [ ] Set environment variables
- [ ] Note frontend URL

### Post-Deployment:
- [ ] Update `CLIENT_URL` in Render with Vercel URL
- [ ] Restart Render service
- [ ] Create admin user in production
- [ ] Test complete workflow
- [ ] Monitor logs for errors

---

## 🎯 Your Deployment URLs

After deployment, update these:

- **Backend API**: `https://wastemap-backend.onrender.com`
- **Frontend App**: `https://wastemap-client.vercel.app`

---

## 💡 Pro Tips

1. **Free Tier Limitations**:
   - Render free tier spins down after 15 minutes of inactivity
   - First request after inactivity takes ~30 seconds to wake up
   - Consider upgrading if you need 24/7 uptime

2. **Environment Variables**:
   - Always redeploy after changing environment variables
   - Use Vercel's dashboard to manage frontend env vars
   - Use Render's dashboard to manage backend env vars

3. **Monitoring**:
   - Check Render logs regularly
   - Use Vercel Analytics (free tier available)
   - Monitor MongoDB Atlas metrics

4. **Security**:
   - Never commit `.env` files
   - Use strong JWT_SECRET in production
   - Enable MongoDB IP whitelist (allow all: 0.0.0.0/0 for Render)

---

**Happy Deploying! 🚀**
