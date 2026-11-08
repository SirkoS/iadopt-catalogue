# Changelog

## unreleased

## 1.0.0

### Features
* allow for nested folder structures in Variables
* added logo
* allow to configure certain settings via `.iadopt-catalogue.yml`
* support subfolders in nav bars
* alphabetic sorting in nav bars
* move to flowbite & tailwindcss
* added responsive layout & dark mode
* added component-based search on main page
* prepared to be used as GitHub action

### Bugfixes
* (de)serializing of blank node Entities with Constrains did not keep the proper link
* cope with Variables that have no title - using local part of IRI if needed
* fix issue with missing config file - properly using default config
* fix local dev setup

## 0.1.0

* first public release
