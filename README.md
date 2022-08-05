# StipDemo

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Issue related to firebase 
run the following command
npm i firebase@latest

# set environment variable
firebase functions:config:set someservice.key="THE API KEY" someservice.id="THE CLIENT ID"

## Notes
-----------Missing/Needed improvde features/functions-------------
here are some functions/features that future developers can be improvded and worked on. 

Browse Page: related files are under /pages/browse/.
1. Currently, the searching functions in Chinese are not fully implemented. More debugging and testing are needed. 
2. Data Standerdanization for the "Occupations" for both Chinese and English is needed, and ngx-translation for both languages is not implemented. Suggested tool: OpenRefine. 
3. "Sorted by relevance" is not implemented. This should happends after each search. Currently, the search results are sorted based on the order of the last name. 
4. The searching speed/performance can be improved. 

  
