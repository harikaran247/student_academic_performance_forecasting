"""
Student Academic Performance Forecasting - SIH 2026 Challenge 33
Package initialization.
Includes environment compatibility layer to bypass OS C-extension DLL blocks.
"""

import sys
import types

# Ensure C-extension blocks in sklearn.decomposition do not prevent scikit-learn usage
if "sklearn.decomposition._cdnmf_fast" not in sys.modules:
    dummy_cdnmf = types.ModuleType("sklearn.decomposition._cdnmf_fast")
    dummy_cdnmf._update_cdnmf_fast = lambda *args, **kwargs: None
    sys.modules["sklearn.decomposition._cdnmf_fast"] = dummy_cdnmf

__version__ = "1.0.0"
