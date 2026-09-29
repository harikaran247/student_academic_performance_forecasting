"""
Model utilities for Student Academic Performance Forecasting.
Provides a robust RandomForestRegressor supporting both native Scikit-Learn RandomForestRegressor
and a pure-Python NumPy-backed RandomForestRegressor (ensuring 100% execution compatibility on OS environments
with strict DLL or Application Control binary policies).
"""

import sys
import types
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, RegressorMixin

# Try importing native sklearn RandomForestRegressor first
NATIVE_RF_AVAILABLE = False
try:
    from sklearn.ensemble import RandomForestRegressor as SklearnRF
    NATIVE_RF_AVAILABLE = True
except Exception:
    NATIVE_RF_AVAILABLE = False


class CustomDecisionTreeRegressor:
    """Pure-Python Decision Tree Regressor."""
    def __init__(self, max_depth=8, min_samples_split=2):
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.tree = None

    def _fit_tree(self, X, y, depth=0):
        n_samples, n_features = X.shape
        if depth >= self.max_depth or n_samples < self.min_samples_split or np.std(y) == 0:
            return {'val': float(np.mean(y))}
        
        best_feat, best_thresh, best_var = None, None, float('inf')
        for feat in range(n_features):
            vals = X[:, feat]
            threshs = np.unique(vals)
            if len(threshs) > 15:
                threshs = np.percentile(vals, np.linspace(5, 95, 12))
            for thresh in threshs:
                left_mask = vals <= thresh
                right_mask = ~left_mask
                if np.sum(left_mask) < 1 or np.sum(right_mask) < 1:
                    continue
                var_l = np.var(y[left_mask]) * np.sum(left_mask)
                var_r = np.var(y[right_mask]) * np.sum(right_mask)
                total_var = var_l + var_r
                if total_var < best_var:
                    best_var = total_var
                    best_feat = feat
                    best_thresh = thresh
                    
        if best_feat is None:
            return {'val': float(np.mean(y))}
            
        left_mask = X[:, best_feat] <= best_thresh
        right_mask = ~left_mask
        return {
            'feat': best_feat,
            'thresh': best_thresh,
            'left': self._fit_tree(X[left_mask], y[left_mask], depth + 1),
            'right': self._fit_tree(X[right_mask], y[right_mask], depth + 1)
        }

    def fit(self, X, y):
        self.tree = self._fit_tree(X, y)
        return self

    def _predict_sample(self, node, x):
        if 'val' in node:
            return node['val']
        if x[node['feat']] <= node['thresh']:
            return self._predict_sample(node['left'], x)
        return self._predict_sample(node['right'], x)

    def predict(self, X):
        return np.array([self._predict_sample(self.tree, row) for row in X])


class RobustRandomForestRegressor(BaseEstimator, RegressorMixin):
    """
    Random Forest Regressor implementing Scikit-Learn Estimator interface.
    Serves as the main Random Forest engine.
    """
    def __init__(self, n_estimators=60, max_depth=10, min_samples_split=2, max_features='sqrt', random_state=42):
        self.n_estimators = n_estimators
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.max_features = max_features
        self.random_state = random_state
        self.trees = []
        self.feature_importances_ = None

    def fit(self, X, y):
        X = np.asarray(X, dtype=np.float64)
        y = np.asarray(y, dtype=np.float64)
        rng = np.random.RandomState(self.random_state)
        n_samples, n_features = X.shape
        self.trees = []
        
        if self.max_features == 'sqrt':
            max_feats = int(np.sqrt(n_features))
        elif isinstance(self.max_features, float):
            max_feats = int(self.max_features * n_features)
        else:
            max_feats = n_features
        max_feats = max(1, min(n_features, max_feats))

        feature_counts = np.zeros(n_features)

        for i in range(self.n_estimators):
            idx = rng.choice(n_samples, size=n_samples, replace=True)
            feat_idx = rng.choice(n_features, size=max_feats, replace=False)
            tree = CustomDecisionTreeRegressor(max_depth=self.max_depth, min_samples_split=self.min_samples_split)
            tree.fit(X[idx][:, feat_idx], y[idx])
            self.trees.append((tree, feat_idx))
            feature_counts[feat_idx] += 1

        self.feature_importances_ = feature_counts / np.sum(feature_counts)
        return self

    def predict(self, X):
        X = np.asarray(X, dtype=np.float64)
        tree_preds = np.column_stack([tree.predict(X[:, feat_idx]) for tree, feat_idx in self.trees])
        return np.mean(tree_preds, axis=1)


def get_random_forest_regressor(n_estimators=100, max_depth=10, random_state=42):
    """
    Returns a Random Forest Regressor instance.
    """
    if NATIVE_RF_AVAILABLE:
        try:
            return SklearnRF(n_estimators=n_estimators, max_depth=max_depth, random_state=random_state)
        except Exception:
            pass
    return RobustRandomForestRegressor(n_estimators=n_estimators, max_depth=max_depth, random_state=random_state)
