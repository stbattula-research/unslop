# design-database — reference data (not a skill)

Curated CSV datasets vendored from
[nicohodt/claude-code-ui-ux-skill](https://github.com/nicohodt/claude-code-ui-ux-skill)
(MIT — see `ATTRIBUTION.md`):

| File | Rows | Contents |
|---|---|---|
| `colors.csv` | 192 | Color palettes (name, hex sets, mood, use-case) |
| `typography.csv` | 74 | Font pairings (heading + body, with roles) |
| `ux-guidelines.csv` | 98 | UX guidelines (rules with rationale) |

Query with any CSV tooling, e.g.:

```
python3 -c "
import csv
rows = list(csv.DictReader(open('colors.csv')))
print([r for r in rows if 'dark' in str(r).lower()][:3])
"
```

Omitted from upstream: `google-fonts.csv` (728KB raw catalog — `typography.csv`
holds the curated pairings), `styles.csv` (140KB single file exceeds push limits;
`ilm-aesthetics/` covers locked aesthetic systems), and the rest of the 16MB repo.
