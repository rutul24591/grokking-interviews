"""
Example 3: Model License Tracking and Compliance

Demonstrates:
- Fetching model license from the Hub
- Tracking licenses across production models
- Automated compliance checking
- License compatibility analysis
"""

from typing import Dict, List, Optional
from dataclasses import dataclass


@dataclass
class ModelLicense:
    model_id: str
    license_name: str
    commercial_use: bool
    modifications_allowed: bool
    distribution_allowed: bool
    restrictions: List[str]
    source: str = "huggingface_hub"


# Known license profiles
LICENSE_PROFILES: Dict[str, Dict] = {
    "apache-2.0": {
        "commercial_use": True,
        "modifications_allowed": True,
        "distribution_allowed": True,
        "restrictions": ["Include license file", "State changes"],
    },
    "mit": {
        "commercial_use": True,
        "modifications_allowed": True,
        "distribution_allowed": True,
        "restrictions": ["Include license and copyright notice"],
    },
    "llama3": {
        "commercial_use": True,
        "modifications_allowed": True,
        "distribution_allowed": True,
        "restrictions": [
            "Max 700M MAU",
            "Do not use output to improve other models",
            "Acceptable use policy",
        ],
    },
    "creativeml-openrail-m": {
        "commercial_use": True,
        "modifications_allowed": True,
        "distribution_allowed": True,
        "restrictions": ["Use restrictions for harmful applications"],
    },
    "gemma": {
        "commercial_use": True,
        "modifications_allowed": True,
        "distribution_allowed": False,
        "restrictions": [
            "Max 1B MAU for commercial use",
            "No redistribution of weights",
        ],
    },
}


class LicenseTracker:
    """Track and validate model licenses for production compliance."""

    def __init__(self):
        self.registered_models: List[ModelLicense] = []

    def register_model(self, model_id: str, license_name: str) -> ModelLicense:
        """Register a model with its license."""
        profile = LICENSE_PROFILES.get(license_name.lower(), {
            "commercial_use": False,
            "modifications_allowed": False,
            "distribution_allowed": False,
            "restrictions": ["Unknown license — verify manually"],
        })

        license_info = ModelLicense(
            model_id=model_id,
            license_name=license_name,
            **profile,
        )
        self.registered_models.append(license_info)
        return license_info

    def check_compatibility(self, use_case: str) -> List[Dict]:
        """Check registered models against a use case."""
        results = []
        for model in self.registered_models:
            issues = []
            if use_case == "commercial" and not model.commercial_use:
                issues.append("Not licensed for commercial use")
            if use_case == "fine-tuning" and not model.modifications_allowed:
                issues.append("Modifications/fine-tuning not allowed")
            if use_case == "redistribution" and not model.distribution_allowed:
                issues.append("Redistribution not allowed")

            results.append({
                "model": model.model_id,
                "license": model.license_name,
                "compatible": len(issues) == 0,
                "issues": issues,
                "restrictions": model.restrictions,
            })
        return results

    def get_report(self) -> str:
        """Generate a compliance report."""
        lines = ["=== Model License Compliance Report ===", ""]
        for model in self.registered_models:
            lines.append(f"Model: {model.model_id}")
            lines.append(f"  License: {model.license_name}")
            lines.append(f"  Commercial: {'Yes' if model.commercial_use else 'No'}")
            lines.append(f"  Restrictions: {', '.join(model.restrictions)}")
            lines.append("")
        return "\n".join(lines)


def main():
    tracker = LicenseTracker()

    # Register production models
    tracker.register_model("meta-llama/Meta-Llama-3-8B", "llama3")
    tracker.register_model("mistralai/Mistral-7B-v0.3", "apache-2.0")
    tracker.register_model("google/gemma-7b", "gemma")
    tracker.register_model("Qwen/Qwen2-7B", "apache-2.0")

    # Check commercial compatibility
    print("=== Commercial Use Compatibility ===")
    for result in tracker.check_compatibility("commercial"):
        status = "COMPATIBLE" if result["compatible"] else "ISSUES"
        print(f"\n  {result['model']} [{result['license']}]")
        print(f"    Status: {status}")
        if result["issues"]:
            for issue in result["issues"]:
                print(f"    Issue: {issue}")
        print(f"    Restrictions: {', '.join(result['restrictions'])}")

    print(f"\n{tracker.get_report()}")


if __name__ == "__main__":
    main()
