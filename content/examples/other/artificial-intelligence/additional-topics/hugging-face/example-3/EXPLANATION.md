# Model License Tracking and Compliance

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`dataclasses`, `typing`).

## What This Demonstrates

This example implements a license tracking system for AI models used in production. It maintains a registry of known license profiles (Apache 2.0, MIT, Llama 3, Gemma, etc.), registers models with their licenses, and performs automated compliance checks against specific use cases (commercial use, fine-tuning, redistribution) to identify licensing restrictions and compatibility issues.

## Code Walkthrough

### Key Classes

- **`ModelLicense`** (dataclass): Represents a model's license information including `model_id`, `license_name`, `commercial_use`, `modifications_allowed`, `distribution_allowed`, and `restrictions` list.
- **`LicenseTracker`**: The core compliance tracker maintaining a registry of licensed models and performing compatibility checks.

### License Profiles

The `LICENSE_PROFILES` dictionary defines known license types with their permissions and restrictions:

- **Apache 2.0**: Fully permissive with attribution requirements.
- **MIT**: Fully permissive with license/copyright notice requirements.
- **Llama 3**: Commercial use allowed but capped at 700M monthly active users, with restrictions on using outputs for model improvement.
- **CreativeML OpenRAIL-M**: Permissive with use restrictions for harmful applications.
- **Gemma**: Commercial use capped at 1B MAU, with no redistribution of model weights.

### Key Methods

1. **`register_model(model_id, license_name)`**: Registers a model by looking up its license profile. Unknown licenses are flagged for manual verification.
2. **`check_compatibility(use_case)`**: Checks all registered models against a specific use case ("commercial", "fine-tuning", "redistribution"). Returns per-model compatibility status with specific issues and restrictions.
3. **`get_report()`**: Generates a human-readable compliance report listing all registered models, their licenses, and restrictions.

### Execution Flow

1. **`main()`** creates a tracker and registers four models: Llama 3 8B (llama3 license), Mistral 7B (Apache 2.0), Gemma 7B (gemma license), and Qwen2 7B (Apache 2.0).
2. Runs a commercial use compatibility check, identifying any restrictions for each model.
3. Prints a full compliance report showing all models, their commercial use permissions, and specific restrictions.

### Important Variables

- `LICENSE_PROFILES`: The authoritative source of license permissions and restrictions.
- `commercial_use`, `modifications_allowed`, `distribution_allowed`: Three boolean flags that gate the primary use cases.
- `restrictions`: A list of specific conditions attached to each license (MAU caps, acceptable use policies, etc.).

## Key Takeaways

- AI model licensing is complex and nuanced -- even "open" licenses like Llama 3 and Gemma have significant restrictions (MAU caps, no-redistribution clauses).
- Automated compliance checking prevents legal risk by identifying license incompatibilities before deployment.
- License tracking is essential for organizations using multiple models -- each model may have different restrictions that need to be enforced.
- Unknown or unrecognized licenses should be flagged for manual legal review rather than assumed permissive.
- Production systems should periodically re-check licenses as model owners may update license terms between versions.
