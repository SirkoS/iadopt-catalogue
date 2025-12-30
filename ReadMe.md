[![DOI](https://zenodo.org/badge/doi/10.5281/zenodo.18098559.svg)](https://doi.org/10.5281/zenodo.18098559)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

# I-Adopt Catalogue

This project provides a simple catalogue for I-Adopt-based variable descriptions.

The result is a collection of static files that can be deployed, e.g., to a github pages.


## Use as Github Action

Sample workflow definition. Put in your repo as `.github/workflows/gh-pages.yml` and activate via settings.

The action will scan your entire repository for `.ttl` files and include them in the catalogue.
The folder structure will serve as categories.

```yaml
name: GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Build catalogue
        uses: SirkoS/iadopt-catalogue@main

      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        if: ${{ github.ref == 'refs/heads/main' }}
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

## Cite as

*Sirko Schindler (2025) “SirkoS/iadopt-catalogue”. Zenodo. doi:10.5281/zenodo.18098559.*

```bibtext
@software{Schindler2025,
  author       = {Sirko Schindler},
  title        = {SirkoS/iadopt-catalogue: v0.1.0},
  month        = dec,
  year         = 2025,
  publisher    = {Zenodo},
  version      = {v0.1.0},
  doi          = {10.5281/zenodo.18098559},
  url          = {https://doi.org/10.5281/zenodo.18098559},
}
```