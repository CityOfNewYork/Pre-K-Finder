# Pre-K for All

This app is a stand-alone HTML5 app that can be dropped into the doc root of any web server.

The upk.csv file included is a snapshot of the Pre-K facilities data for development use only.

In production the Pre-K facilities data may change without notice and is cached at a CDN daily.

* Use ```gradle -Penv=dev buildApp``` to build for gis dev environment
* Use ```gradle -Penv=stg buildApp``` to build for gis stg environment
* Use ```gradle -Penv=prd buildApp``` to build for gis prd environment
* Use ```gradle jettRun``` to run from project root on local Jetty web server
	* Allows for viewing live edits of src/main/webapp
	* Allows for viewing a build from build/webapp

This application is no longer under development and will be replaced by a version utilizing openlayers 3 (https://github.com/CityOfNewYork/pka.git)
