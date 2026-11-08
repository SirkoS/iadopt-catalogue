[![DOI](https://zenodo.org/badge/doi/10.5281/zenodo.18098559.svg)](https://doi.org/10.5281/zenodo.18098559)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

# I-Adopt Catalogue

This project provides a simple catalogue for I-Adopt-based variable descriptions.

The result is a collection of static files that can be deployed, e.g., to GitHub pages.


## Use as Github Action

1. In your repository, add TTL files in a folder structure following your categories.
2. Under `Settings` → `Pages` make sure that `Source` `GitHub Actions` is activated.
3. Add the below sample workflow in your repo as `.github/workflows/gh-pages.yml`.
  * You can pin a specific version by using, e.g., `docker://sirkos/iadopt-catalogue:1.0.0` instead of `docker://sirkos/iadopt-catalogue:latest`.

The action will scan your entire repository for `.ttl` files and include them in the catalogue.
The folder structure will serve as categories.

```yaml
name: IAdopt-Catalogue - GitHub Pages

on:
  workflow_dispatch:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Build catalogue
        uses: docker://sirkos/iadopt-catalogue:latest

      - name: Upload Artifacts
        uses: actions/upload-pages-artifact@v5
        with:
          path: "build/"

  deploy:
    needs: build
    runs-on: ubuntu-latest

    permissions:
      pages: write
      id-token: write

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v5
```


## Customizing

You can customize some texts via adding a `.iadopt-catalogue.yml` in the base folder of your repository.
Recognized settings are:
* `title`     &hellip; main title of the page
* `subtitle`  &hellip; subtitle of the page; directly below main title
* `footer`    &hellip; footer text, e.g., containing copyright notice



## Cite as

*Sirko Schindler (2025) “SirkoS/iadopt-catalogue”. Zenodo. doi:10.5281/zenodo.18098559.*

```bibtext
@software{Schindler2025,
  author       = {Sirko Schindler},
  title        = {SirkoS/iadopt-catalogue},
  month        = dec,
  year         = 2025,
  publisher    = {Zenodo},
  doi          = {10.5281/zenodo.18098559},
  url          = {https://doi.org/10.5281/zenodo.18098559},
}
```

or check [Zenodo](https://doi.org/10.5281/zenodo.18098559) for the DOI to the version you use.