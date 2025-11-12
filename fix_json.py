import json

# Fix English file
try:
    with open('src/locales/en/common.json.backup', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the first "auth" occurrence and keep everything from there
    first_auth_pos = content.find('"auth": {')
    if first_auth_pos == -1:
        print("Could not find auth section")
        exit(1)
    
    # Find everything before the duplicate ecosystem section
    # Keep from start until after "footer": "Constellation Platform..."
    target = '"footer": "Constellation Platform · Built for realtors with unreasonable ambition"'
    target_pos = content.find(target)
    if target_pos == -1:
        print("Could not find target footer text")
        exit(1)
    
    # Find the closing brace and comma after this line
    closing_pos = content.find('\n    }', target_pos)
    stellaPlatform_end = content.find('\n  },', closing_pos)
    
    # Get the part after the duplicate ecosystem
    auth_start = content.find('\n  "auth": {', stellaPlatform_end)
    
    # Reconstruct the file
    fixed_content = content[:stellaPlatform_end + 5] + content[auth_start:]
    
    with open('src/locales/en/common.json', 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    
    # Validate JSON
    json.loads(fixed_content)
    print("English file fixed successfully!")
    
except Exception as e:
    print(f"Error fixing English file: {e}")
    import traceback
    traceback.print_exc()
