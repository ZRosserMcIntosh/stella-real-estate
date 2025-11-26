# Subdomain Deployment Checklist

## Pre-Deployment

- [x] Updated `vercel.json` with redirect rules
- [x] Updated `src/utils/subdomain.ts` for `.com.br` support
- [x] Updated `SubdomainRouter.tsx` with redirect logic
- [ ] Tested locally (if possible)

## DNS Configuration

Configure these CNAME records in your DNS provider:

```
Host/Name          Type    Value
-----------------------------------------
constellation      CNAME   cname.vercel-dns.com.
stellareal         CNAME   cname.vercel-dns.com.
```

Or use A records:
```
Host/Name          Type    Value
-----------------------------------------
constellation      A       76.76.21.21
stellareal         A       76.76.21.21
```

**Note:** Check Vercel dashboard for the exact DNS records for your project.

## Vercel Domain Configuration

Add these domains in Vercel:

1. Go to: https://vercel.com/[your-team]/stella-real-estate/settings/domains
2. Add domains:
   - [ ] `constellation.stellareal.com.br`
   - [ ] `stellareal.stellareal.com.br`
3. Wait for DNS verification (can take 24-48 hours)

## Deploy to Production

```bash
# Commit changes
git add .
git commit -m "feat: implement subdomain redirects for /sub/* paths"

# Deploy to production
vercel --prod
```

Or push to main branch if auto-deploy is enabled:
```bash
git push origin main
```

## Post-Deployment Testing

### Test Redirects

```bash
# Test constellation redirect
curl -I https://stellareal.com.br/sub/constellation
# Should return: Location: https://constellation.stellareal.com.br/

# Test with path
curl -I https://stellareal.com.br/sub/constellation/login
# Should return: Location: https://constellation.stellareal.com.br/login

# Test stellareal redirect
curl -I https://stellareal.com.br/sub/stellareal
# Should return: Location: https://stellareal.stellareal.com.br/
```

### Browser Testing

Visit these URLs and verify they redirect:

- [ ] `https://stellareal.com.br/sub/constellation` → `https://constellation.stellareal.com.br/`
- [ ] `https://stellareal.com.br/sub/constellation/login` → `https://constellation.stellareal.com.br/login`
- [ ] `https://stellareal.com.br/sub/stellareal` → `https://stellareal.stellareal.com.br/`

### Verify Subdomain Content

Visit these URLs directly and verify correct content loads:

- [ ] `https://constellation.stellareal.com.br/` - Shows Constellation portal
- [ ] `https://constellation.stellareal.com.br/login` - Shows login page
- [ ] `https://stellareal.stellareal.com.br/` - Shows Stella Real content

### Check DNS Propagation

```bash
# Check if DNS has propagated
dig constellation.stellareal.com.br
dig stellareal.stellareal.com.br

# Alternative
nslookup constellation.stellareal.com.br
nslookup stellareal.stellareal.com.br
```

## Troubleshooting

### DNS Not Propagating
- Wait 24-48 hours for full propagation
- Use https://dnschecker.org to check global status
- Try flushing local DNS cache:
  ```bash
  # macOS
  sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
  
  # Windows
  ipconfig /flushdns
  ```

### Vercel Shows "Domain Not Found"
1. Ensure domain is added in Vercel settings
2. Check that DNS records point to Vercel
3. Wait for SSL certificate provisioning (automatic)

### Redirects Not Working
1. Check that code changes are deployed: `vercel ls`
2. Verify `vercel.json` is valid JSON
3. Check browser console for errors
4. Try in incognito mode (cache issues)

### SSL Certificate Issues
- Vercel automatically provisions SSL for verified domains
- Can take a few minutes after DNS verification
- Check status in Vercel dashboard

## Rollback Plan

If something goes wrong:

1. **Revert code changes:**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Or deploy previous version:**
   ```bash
   # Find deployment ID
   vercel ls
   
   # Promote previous deployment
   vercel promote [deployment-url]
   ```

3. **Remove DNS records if needed** (stops subdomain access)

## Success Criteria

✅ All checks passed when:
- `/sub/constellation` redirects to `constellation.stellareal.com.br`
- `/sub/stellareal` redirects to `stellareal.stellareal.com.br`
- Subdomain URLs load correct content
- No console errors
- SSL certificates are active
- DNS propagated globally

## Next Steps

After successful deployment:

1. Update internal links to use subdomain URLs directly
2. Update any documentation referencing `/sub/*` paths
3. Monitor analytics for any redirect issues
4. Consider adding more subdomains as needed

## Command Reference

```bash
# Deploy to production
vercel --prod

# Check deployments
vercel ls

# View logs
vercel logs [deployment-url]

# Check domain status
vercel domains ls

# Add domain
vercel domains add constellation.stellareal.com.br

# Remove domain
vercel domains rm constellation.stellareal.com.br
```
