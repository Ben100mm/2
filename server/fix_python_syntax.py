#!/usr/bin/env python3
"""
Script to convert Python 3.10+ syntax to Python 3.9 compatible syntax
"""

import os
import re
import logging
import sys
from pathlib import Path

def fix_python_syntax(file_path):
    """Fix Python syntax in a file"""
    try:
        # Validate file path
        if not os.path.exists(file_path):
            logging.error(f"File not found: {file_path}")
            return False
            
        if not file_path.endswith('.py'):
            logging.warning(f"Skipping non-Python file: {file_path}")
            return False
            
        # Read file content
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Add Union import if needed
        if '|' in content and 'from typing import' in content and 'Union' not in content:
            # Add Union to existing typing import
            content = re.sub(
                r'(from typing import[^,\n]*)',
                r'\1, Union',
                content
            )
        elif '|' in content and 'from typing import' not in content:
            # Add typing import
            content = 'from typing import Union, List, Dict\n' + content
        
        # Convert union syntax
        content = re.sub(r'(\w+)\s*\|\s*None', r'Union[\1, None]', content)
        content = re.sub(r'None\s*\|\s*(\w+)', r'Union[None, \1]', content)
        content = re.sub(r'(\w+)\s*\|\s*(\w+)', r'Union[\1, \2]', content)
        
        # Convert list and dict syntax
        content = re.sub(r'list\[', 'List[', content)
        content = re.sub(r'dict\[', 'Dict[', content)
        
        # Only write if content changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            logging.info(f"Successfully fixed syntax in: {file_path}")
            return True
        else:
            logging.info(f"No changes needed for: {file_path}")
            return True
            
    except Exception as e:
        logging.error(f"Error processing file {file_path}: {str(e)}")
        return False

def main():
    """Main function"""
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    try:
        # Get current directory
        current_dir = Path('.')
        
        # Find all Python files
        python_files = list(current_dir.glob('*.py'))
        
        if not python_files:
            logging.warning("No Python files found in current directory")
            return
        
        logging.info(f"Found {len(python_files)} Python files to process")
        
        success_count = 0
        error_count = 0
        
        for file_path in python_files:
            try:
                logging.info(f"Processing {file_path.name}...")
                if fix_python_syntax(str(file_path)):
                    success_count += 1
                else:
                    error_count += 1
            except Exception as e:
                logging.error(f"Failed to process {file_path.name}: {str(e)}")
                error_count += 1
        
        # Summary
        logging.info(f"Processing complete: {success_count} successful, {error_count} errors")
        
        if error_count > 0:
            sys.exit(1)
            
    except Exception as e:
        logging.error(f"Fatal error in main: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()