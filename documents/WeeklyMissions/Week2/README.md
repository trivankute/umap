# **Week 2 Missions 12/6->18/6**

**[Checkin on this intern team's google drive of Week 2](https://docs.google.com/spreadsheets/d/1pmXoyhfSgix3a2zq8Ud1LYfidF0I3x0ANpQIF2369Sc/edit#gid=1359045866)**


## **Mission 1: Onsite Data Initialization with Postgres Online and Geoserver Online**

**(Deadline: 2 days from 13->15/6)**

Description:
- Integrate small current OSM data of VietName like only the area near Dormitory Zone A of National University HCMC on Postgis Online With PgAdmin4. (13/6/2023)

  **=> Objective**: Build up slice to present about how to connect and guild the teammate. Eventually, everyone can access to the data on Postgis Online on their PgAdmin4. **(Remember to enable UpdatedTime config
  of Osm2pgsql when import data to Postgis Online to track the realtime updated of OSM data)**
- Connect GeoServer Online to Intergrated Data on Postgis Online. Following the experience gained from Week 1.

  **=> Objective**: everyone can access to the Layer Previews of the integrated map on GeoServer Online.


## **Mission 2: Getting and Updating the newest OSM data manually or automaticcally to PostGis online data**

Description:
- **Task 1**: One person will try to get the newest data from Openstreetmat with output format is application/json for convenience
  
  **(Deadline: 1.5 days from 14->15.5/6)**

  **=> Objective**: Build up slice to present the format of the data and how to take the data from OSM by hourly, dayly or weekly and where you can get it.

- **Task 2**: One person will try to update the newest data to Postgis Online with the data from Task 1. (Notice the format of Postgis Data, do we need tool or library to update data automatically or not? Remember the need of using Osm2pgsql before starting import, how to do it automatically?). 
  
  **(Deadline: 2 days from 14->16/6)**

  **=> Objective**: Build up an API for updating with nodeJS inside NextJS as Mentor Loc required the system to be able to update manually and can think of using Schedule Library if you want to do it automatically. (Schedule Library is a library can help us to update the data automatically by time we set up, with the ability to run and inform to admin if there is any error when updating data). Make a slice to present how you build the API and the process also result of updating data.


## **Mission 3: Web-Map-View**

**(Deadline: 2 days from 13->15/6)**

Description:
-   Learning about Leaflet, How to integrate it on NextJs? With which library?
  
    **=> Objective**: Enable to get the map from OpenStreetMap Or GeoServer and view it on Leaflet Map on NextJs. Make a slice on the process you implemented it and does it related to those knowledge you learned from Week 1.
-   Exploring all the features of Leaflet and how to use it (Zoom, Edit, Popup, Marker, Draw Point or Line or Polygon etc.). Also know how to interact with the data of GeoServer through Leaflet map or WFS or WFS.
  
    **=> Objective**: Enable to use all the features of Leaflet to view the map on NextJs. Make a slice on the process you implemented each feature.


## **Mission 4: Web-Map-Basic-Layout**

**(Deadline: 3 days from 13->16/6)**

Description: 
-   Mimic the UI of Google Map. Define the components you are going to build up for this. Build it with ReactJS on the client of NextJS project.
  
    **=> Objective**: Enable to build up the basic layout of Google Map on NextJs (at least the Searbar, Sidebar to show up the results of searching). You can make more like routing UI, Filter UI, Header, Footer bla bla. Make a slice on the process you implemented it and how to use each component.

# **Work Assignments**

-   **Mission 1 and 2:** Khoa & Van
-   **Mission 3:** Dung
-   **Mission 4:** Minh

**Notification** If you find this lack of some information. You can help me to add it. Thank you very much. Tri Van (2pm 13/6/2023). Good luck to everyone. 

**Bonus links from mentor Loc**
- [geoserver-node-client](https://github.com/meggsimum/geoserver-node-client)
- [geoserver suppports rest api docs](https://docs.geoserver.org/stable/en/user/rest/index.html)
- [OSMChange của chỉ việt nam thì ở đây nhé](https://download.geofabrik.de/asia/vietnam-updates/)

**Docker lecture from mentor Loc, on company and reference link**
- [docker](https://viblo.asia/p/docker-la-gi-kien-thuc-co-ban-ve-docker-maGK7qeelj2)