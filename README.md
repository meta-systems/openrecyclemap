# OpenRecycleMap - a waste sorting app

![OpenRecycleMap](https://raw.githubusercontent.com/meta-systems/openrecyclemap/master/public/android-chrome-144x144.png)

[openrecyclemap.org](https://openrecyclemap.org/)

OpenRecycleMap is a project that helps organize separate waste collection. The project is based on data from OpenStreetMap, an open map that anyone can edit.

## Translations

You can offer translation into your language based on the [English language file](https://github.com/meta-systems/openrecyclemap/blob/master/src/locales/en.json)
All languages are presented [here](https://github.com/meta-systems/openrecyclemap/tree/master/src/locales).

If you are not a programmer, you can offer translations in Google Docs: [interface translation](https://docs.google.com/spreadsheets/d/1wcWLC9N_1PCuEOGHTzIwC4OfSGk7m-iqQ3kwTK41NKU/edit), [fraction translation](https://docs.google.com/spreadsheets/d/1y_jrYFILxpS1ch8Mr0vU0LQfXBjsSJi20pbICOHu2tM/edit).

## Installation

- Install vue https://vuejs.org/v2/guide/installation.html#NPM
  `npm install vue`
- Install vue/cli https://cli.vuejs.org/#getting-started
  `npm install -g @vue/cli`

## Development

- Run `npm run serve`

In this mode the app uses an osm dev server.

## Production

- Run `npm run build`

In this mode the app uses an osm production server. Your changes will affect a live OSM database.

## OSM Tags

The table below describes the tags that the app currently supports.

| Title in UI     |    OSM Tag                | Note |
|-----------------|---------------------------|------|
| Plastic         | recycling:plastic         |      |
| Plastic bottles | recycling:plastic_bottles |      |
| Glass bottles   | recycling:glass_bottles   |      |
| Glass           | recycling:glass           |      |
| Paper           | recycling:paper           |      |
| Cans            | recycling:cans            |      |
| Plastic bags    | recycling:plastic_bags    |      |
| Clothes         | recycling:clothes         |      |
| Hazardous waste | recycling:hazardous_waste |      |
| Scrap metal     | recycling:scrap_metal     |      |
| Low energy bulbs| recycling:low_energy_bulbs|      |
| Batteries       | recycling:batteries       |      |
| Tyres           | recycling:tyres           |      |
| Car batteries   | recycling:car_batteries   |      |
| Engine oil      | recycling:engine_oil      |      |

More information about tags you can get on [OSM Wiki](https://wiki.openstreetmap.org/wiki/Tag:amenity%3Drecycling).

Information about how frequently these tags are used you can get on [Taginfo](https://taginfo.openstreetmap.org/tags/amenity=recycling#combinations).
