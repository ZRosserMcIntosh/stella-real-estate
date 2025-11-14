#!/usr/bin/env python3
"""
Script to restore all changes to StellaPlatform.tsx that were lost.
This systematically removes unwanted sections and updates the phase layout.
"""

import re

# Read the file
with open('src/pages/StellaPlatform.tsx', 'r') as f:
    content = f.read()

print("Starting file restoration...")
print(f"Initial length: {len(content)} characters, {len(content.splitlines())} lines")

# 1. Remove Core Features section (AI & Social Proof boxes)
print("\n1. Removing Core Features (AI & Social Proof boxes)...")
core_features_pattern = r'\s*{/\* Core Features \*/}.*?</div>\s*</div>\s*(?=\s*{/\* 8 User Types Grid \*/})'
content = re.sub(core_features_pattern, '\n', content, flags=re.DOTALL)

# 2. Remove 8 User Types Grid section
print("2. Removing 8 User Types Grid...")
user_types_pattern = r'\s*{/\* 8 User Types Grid \*/}.*?</div>\s*</div>\s*(?=\s*{/\* Pending Services \*/})'
content = re.sub(user_types_pattern, '\n', content, flags=re.DOTALL)

# 3. Remove "Why Stella" section
print("3. Removing Why Stella section...")
why_stella_pattern = r'\s*{/\* Why Stella \*/}.*?</div>\s*</div>\s*(?=\s*</div>\s*</section>)'
content = re.sub(why_stella_pattern, '\n', content, flags=re.DOTALL)

# 4. Remove Seguro Fiança section
print("4. Removing Seguro Fiança section...")
seguro_pattern = r'\s*{/\* Seguro Fiança Section \*/}.*?</section>\s*(?=\s*{/\* Ecosystem CTA \*/})'
content = re.sub(seguro_pattern, '\n', content, flags=re.DOTALL)

# 5. Update Pending Services section to compact single-column layout without emojis
print("5. Updating phase layout to compact single-column...")

# Find the Pending Services section and replace it
pending_services_old = r'{/\* Pending Services \*/}[\s\S]*?(?=\s*{/\* Why Stella \*/}|\s*</div>\s*</div>\s*</section>)'

new_pending_services = '''          {/* Phase Rollout */}
          <div className="mb-16">
            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                { key: 'realtors', phaseNum: 1, color: 'blue' },
                { key: 'retailAggregation', phaseNum: 2, color: 'emerald' },
                { key: 'developers', phaseNum: 3, color: 'orange' },
                { key: 'architects', phaseNum: 4, color: 'pink' },
                { key: 'designers', phaseNum: 5, color: 'purple' },
                { key: 'rentalManagers', phaseNum: 6, color: 'cyan' },
                { key: 'insurance', phaseNum: 7, color: 'amber' }
              ].map(({ key, phaseNum, color }) => (
                <div key={key} className={`group relative overflow-hidden rounded-xl border border-${color}-500/30 bg-gradient-to-br from-${color}-600/10 via-slate-900/50 to-slate-950 p-6 hover:border-${color}-500/60 transition-all duration-300`}>
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold text-${color}-300 uppercase tracking-wider`}>
                        PHASE {phaseNum}
                      </span>
                      <span className="text-slate-600">•</span>
                      <h4 className="text-lg font-semibold text-white">
                        {t(`stellaPlatform.ecosystem.pendingServices.${key}.title`)}
                      </h4>
                    </div>
                    <div className={`px-3 py-1 rounded-lg bg-${color}-500/10 border border-${color}-400/30`}>
                      <p className={`text-xs font-bold text-${color}-300`}>
                        {t(`stellaPlatform.ecosystem.pendingServices.${key}.deliveryDate`)}
                      </p>
                    </div>
                  </div>

                  {/* Account Types */}
                  <div className="mb-4">
                    <p className={`text-xs text-${color}-400 font-semibold uppercase tracking-wider mb-2`}>
                      {t('stellaPlatform.ecosystem.accountTypesLabel')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {getTranslationArray(`stellaPlatform.ecosystem.pendingServices.${key}.accountTypes`).map((type, idx) => (
                        <span key={idx} className={`text-xs px-2.5 py-1 rounded-lg bg-${color}-500/15 border border-${color}-400/40 text-${color}-200 font-medium`}>
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className={`text-xs text-${color}-300 font-semibold mb-2 uppercase tracking-wider`}>
                        MVP Features
                      </p>
                      <ul className="space-y-1.5">
                        {getTranslationArray(`stellaPlatform.ecosystem.pendingServices.${key}.phase1`).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className={`text-${color}-400 mt-0.5`}>✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wider">
                        {t('stellaPlatform.ecosystem.pendingLabel')}
                      </p>
                      <ul className="space-y-1.5">
                        {getTranslationArray(`stellaPlatform.ecosystem.pendingServices.${key}.pending`).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                            <span className="text-slate-600 mt-0.5">○</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
'''

content = re.sub(pending_services_old, new_pending_services, content, flags=re.DOTALL)

print(f"\nFinal length: {len(content)} characters, {len(content.splitlines())} lines")

# Write the modified content back
with open('src/pages/StellaPlatform.tsx', 'w') as f:
    f.write(content)

print("\n✅ File restoration complete!")
print("Changes made:")
print("  - Removed Core Features (AI & Social Proof boxes)")
print("  - Removed 8 User Types Grid")
print("  - Removed Why Stella section")
print("  - Removed Seguro Fiança section")
print("  - Updated phase layout to compact single-column without emojis")
print("  - Title/subtitle already updated by previous sed commands")
