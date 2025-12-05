# SEO Listing Creation Checklist

## 🎯 Overview
This checklist ensures every property listing on Stella Real Estate is optimized for maximum search engine visibility and rankings. Follow this **before** publishing any listing to `/projetos`.

---

## ✅ Required Fields for SEO Excellence

### 1. **Title (Título)** - `title` field
**SEO Impact:** High - Used in page title and search results

**Requirements:**
- ✅ 40-60 characters (optimal for Google display)
- ✅ Include location (neighborhood or city)
- ✅ Include property type (e.g., "Apartamento", "Cobertura", "Casa")
- ✅ Include key feature if luxury (e.g., "Alto Padrão", "Varanda Gourmet")

**Examples:**
- ✅ GOOD: "Apartamento Alto Padrão em Pinheiros - 3 Suítes"
- ✅ GOOD: "Cobertura Duplex na Vila Madalena com Vista"
- ❌ BAD: "Novo Lançamento" (too vague, no location)
- ❌ BAD: "Super Apartamento Legal na Zona Sul de SP" (too long, informal)

### 2. **Description (Descrição)** - `description` field
**SEO Impact:** High - Used in meta description and structured data

**Requirements:**
- ✅ 150-300 characters (160 is ideal for meta description)
- ✅ Start with property type and location
- ✅ Mention 3-5 key features (bedrooms, area, amenities)
- ✅ Include call-to-action
- ✅ Natural, readable Portuguese (no keyword stuffing)

**Template:**
```
{Property type} em {neighborhood/city} com {bedrooms} dormitórios, {bathrooms} banheiros, {area}m². Destaque para {amenity 1}, {amenity 2} e {amenity 3}. {Call to action}.
```

**Examples:**
- ✅ GOOD: "Apartamento de alto padrão em Pinheiros com 3 suítes, 2 vagas, 150m². Destaque para varanda gourmet, churrasqueira e vista panorâmica. Lançamento com condições especiais."
- ❌ BAD: "Lindo apartamento" (too short, no details)

### 3. **Address & Location** - `address_line1`, `neighborhood`, `city`, `state_code`
**SEO Impact:** Critical - Powers local SEO and rich snippets

**Requirements:**
- ✅ `city`: Always fill (e.g., "São Paulo", "Rio de Janeiro")
- ✅ `state_code`: Always fill (e.g., "SP", "RJ")
- ✅ `neighborhood`: CRITICAL for local SEO (e.g., "Pinheiros", "Leblon")
- ✅ `address_line1`: Full street address for exact location
- ✅ `postal_code`: CEP for geo-targeting

**Why it matters:**
- Google uses this for "apartments in Pinheiros" searches
- Rich snippets show location in search results
- Map integration depends on complete address

### 4. **Property Features** - Numeric fields
**SEO Impact:** High - Used in structured data for rich snippets

**Requirements:**
- ✅ `bedrooms`: Number of bedrooms (or "dormitórios")
- ✅ `bathrooms`: Number of bathrooms
- ✅ `area_m2`: Total area in square meters
- ✅ `parking_spaces`: Number of parking spots
- ✅ `land_area_m2`: For houses/land (optional for apartments)

**Pro Tip:** These appear in Google's property filters - be accurate!

### 5. **Price Information** - `price` field + `features.unit_price`
**SEO Impact:** High - Shown in rich snippets

**Requirements:**
- ✅ Always provide starting price
- ✅ For new projects: set `features.unit_price` (per unit)
- ✅ Use realistic market values (Google can penalize fake prices)

**Note:** Prices appear in search results: "A partir de R$ 850.000"

### 6. **Images** - Gallery uploads
**SEO Impact:** Medium - Affects image search and engagement

**Requirements:**
- ✅ **Minimum 5 images** (first becomes thumbnail)
- ✅ **Optimal: 10-15 images** covering:
  - Exterior/facade
  - Living areas
  - Bedrooms
  - Kitchen
  - Bathrooms
  - Amenities (pool, gym, party room)
  - Views
- ✅ High quality (1920px wide minimum)
- ✅ Well-lit, professional photos preferred

**SEO Benefit:** 
- First 5 images indexed in structured data
- Better click-through from search results
- Image search visibility

### 7. **YouTube Background Video** (Optional but Recommended)
**SEO Impact:** Medium - Boosts engagement and time-on-page

**Requirements:**
- ✅ Use property tour or drone footage
- ✅ Paste full YouTube URL in "Vídeo de Fundo"
- ✅ Video should be 1-3 minutes long

---

## 🔥 Advanced SEO Optimization

### Floorplans (Plantas)
**SEO Impact:** Medium - Shows professionalism, reduces bounce rate

**When to add:**
- ✅ New projects: ALWAYS add floorplans
- ✅ For sale: Add if available
- ✅ For rent: Optional

**Best practices:**
- Add multiple floorplan options (Studio, 1 dorm, 2 dorms, etc.)
- Include area (m²) for each
- Include unit count if new project

### Features Object - Extra Data
**SEO Impact:** High - Powers rich snippets

**Recommended additions to `features` JSON:**
```json
{
  "expected_delivery_month": "Dezembro",
  "expected_delivery_year": 2026,
  "units_available": 120,
  "total_inventory_value": 150000000,
  "amenities": [
    "Piscina aquecida",
    "Academia completa",
    "Salão de festas",
    "Espaço gourmet",
    "Quadra poliesportiva"
  ],
  "construction_status": "Em lançamento",
  "builder": "Construtora ABC",
  "show_exact_address": true
}
```

**Why it matters:**
- `amenities` → More keywords for Google to index
- `expected_delivery` → Helps buyers filter by timeline
- `units_available` → Creates urgency in structured data

---

## 🚨 Pre-Publish Checklist

Before clicking "Criar Projeto", verify:

- [ ] **Title**: 40-60 characters, includes location and property type
- [ ] **Description**: 150-300 characters, mentions key features
- [ ] **City**: Filled
- [ ] **State Code**: Filled (SP, RJ, etc.)
- [ ] **Neighborhood**: Filled (CRITICAL for local SEO)
- [ ] **Address**: Complete street address
- [ ] **Bedrooms**: Filled
- [ ] **Bathrooms**: Filled
- [ ] **Area (m²)**: Filled
- [ ] **Parking**: Filled
- [ ] **Price**: Realistic starting price set
- [ ] **Images**: Minimum 5, optimally 10-15 uploaded
- [ ] **Gallery First Photo**: Best showcase image (becomes thumbnail)
- [ ] **Floorplans**: Added for new projects
- [ ] **Expected Delivery**: Set month/year for new projects
- [ ] **Units Available**: Set for new projects

---

## 📊 SEO Quality Levels

### ⭐⭐⭐⭐⭐ Platinum SEO (Target for all listings)
- All required fields filled
- 10+ high-quality images
- YouTube video added
- Multiple floorplans (new projects)
- Detailed amenities in features
- Complete address with coordinates

**Result:** Rich snippets in Google, top rankings for neighborhood searches

### ⭐⭐⭐⭐ Gold SEO (Acceptable)
- All required fields filled
- 5-9 images
- Floorplans for new projects
- Basic amenities listed

**Result:** Standard search visibility, some rich snippet eligibility

### ⭐⭐⭐ Silver SEO (Needs Improvement)
- Missing 1-2 required fields
- Only 3-4 images
- No floorplans

**Result:** Limited search visibility, no rich snippets

### ⭐ Bronze SEO (Unacceptable - Do Not Publish)
- Missing multiple required fields
- Fewer than 3 images
- Generic title/description

**Result:** Poor rankings, low click-through, brand damage

---

## 🔍 How to Verify Your SEO

### Before Publishing
1. **Preview Your Listing**: Check how title/description display
2. **Image Check**: Ensure first image is the best showcase photo
3. **Character Count**: Use character counter for title (40-60) and description (150-300)

### After Publishing
1. **Google Rich Results Test** (1-2 days after publish):
   - Go to: https://search.google.com/test/rich-results
   - Enter: `https://stellareal.com.br/projetos/[your-listing-slug]`
   - Verify: "RealEstateListing" detected with price, images, address

2. **Google Search Console** (1-2 weeks after publish):
   - Monitor impressions for listing URL
   - Check "Rich results" report for property data

3. **Actual Search Test** (2-4 weeks after publish):
   - Google: "apartamento em [neighborhood]"
   - Look for Stella listing with rich snippet (image, price, features)

---

## 💡 Common SEO Mistakes to Avoid

❌ **Mistake 1**: Generic titles like "Novo Lançamento"
✅ **Fix**: "Apartamento 3 Suítes em Pinheiros - Lançamento 2025"

❌ **Mistake 2**: Missing neighborhood field
✅ **Fix**: Always fill "Bairro" - it's critical for local searches

❌ **Mistake 3**: Uploading only 1-2 images
✅ **Fix**: Minimum 5 images, aim for 10-15

❌ **Mistake 4**: Vague descriptions like "Lindo apartamento na zona sul"
✅ **Fix**: "Apartamento 120m² em Moema com 3 dorms, 2 vagas, varanda gourmet"

❌ **Mistake 5**: Not setting price (leaving null)
✅ **Fix**: Always set starting price, even if "A partir de..."

❌ **Mistake 6**: Forgetting floorplans for new projects
✅ **Fix**: Upload at least 2-3 floorplan variations

❌ **Mistake 7**: Using ALL CAPS in titles
✅ **Fix**: Use proper capitalization: "Apartamento Alto Padrão"

---

## 📈 Expected SEO Results

Following this checklist, you should see:

### Week 1-2
- Listing indexed in Google
- Appears in "site:stellareal.com.br" searches

### Week 3-4
- Rich snippets start appearing in Google search
- Ranking for long-tail keywords (e.g., "apartamento 3 quartos pinheiros lançamento")

### Month 2-3
- Ranking improvements for competitive keywords
- Appearing in Google Maps property searches
- Higher click-through rates from rich snippets

### Month 3-6
- Top 10 rankings for neighborhood-specific searches
- Consistent organic traffic to listing
- Competing with Viva Real, ZAP Imóveis for same properties

---

## 🎓 Training & Support

**Questions about SEO?**
- Read: `/docs/SEO_LISTINGS_OPTIMIZATION.md` (technical documentation)
- Ask: CTO (Zack) or development team
- Verify: Use Google Rich Results Test tool

**Need help with a specific listing?**
1. Create draft listing first
2. Run through this checklist
3. Request review before publishing
4. Make corrections
5. Publish and monitor results

---

## 🔄 Continuous Improvement

SEO is ongoing. After publishing:

1. **Monitor Performance** (monthly):
   - Google Search Console for each listing
   - Track impressions, clicks, average position

2. **Update Regularly**:
   - Refresh images if you get better photos
   - Add more amenities as they're completed
   - Update availability for new projects

3. **Learn from Winners**:
   - Identify your best-performing listings
   - Replicate their SEO patterns
   - Apply learnings to new listings

---

## 📋 Quick Reference Card

```
✅ SEO CHECKLIST - PRINT THIS!

□ Title: 40-60 chars, location + type
□ Description: 150-300 chars, features + CTA  
□ City: ___________
□ State: ___
□ Neighborhood: ___________ (CRITICAL!)
□ Address: Complete
□ Bedrooms: ___
□ Bathrooms: ___
□ Area m²: ___
□ Parking: ___
□ Price: R$ ___________
□ Images: ___ / 15 (min 5)
□ First image: Best showcase? YES / NO
□ Floorplans: ___ uploaded
□ Delivery date: ___/___
□ Video: YouTube URL added? YES / NO

Quality Level: ⭐⭐⭐⭐⭐
Ready to publish? YES / NO
```

---

**Last Updated:** December 2025  
**Version:** 1.0  
**Owner:** Stella Real Estate - CTO Office
