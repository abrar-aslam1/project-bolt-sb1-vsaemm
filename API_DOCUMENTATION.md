The api code is this:
curl --location --request POST 'https://api.dataforseo.com/v3/serp/google/organic/live/advanced' \
--header 'Authorization: Basic YWJyYXJAYW1hcm9zeXN0ZW1zLmNvbTo2OTA4NGQ4YzhkY2Y4MWNk' \
--header 'Content-Type: application/json' \
--data-raw '[{"keyword":"weather forecast", "location_code":2826, "language_code":"en", "device":"desktop", "os":"windows", "depth":100}]'

Use this data to request from datafromSEO API, and this is the example response to sparse from this what I think should be included :

The business Name:     "title": "Keestone Events",
The business URL: "url": "https://keestoneevents.com/",
Business Ratting:
 "rating": {
            "rating_type": "Max5",
            "value": 5,
            "votes_count": 88,
            "rating_max": null
          },

<example_reponse>

{
  "id": "01230427-8571-0139-0000-e95ccc6c27ed",
  "status_code": 20000,
  "status_message": "Ok.",
  "time": "6.0501 sec.",
  "cost": 0.002,
  "result_count": 1,
  "path": [
    "v3",
    "serp",
    "google",
    "maps",
    "live",
    "advanced"
  ],
  "data": {
    "api": "serp",
    "function": "live",
    "se": "google",
    "se_type": "maps",
    "keyword": "wedding planner dallas",
    "location_code": 2840,
    "language_code": "en",
    "device": "desktop",
    "os": "windows",
    "depth": 10
  },
  "result": [
    {
      "keyword": "wedding planner dallas",
      "type": "maps",
      "se_domain": "google.com",
      "location_code": 2840,
      "language_code": "en",
      "check_url": "https://google.com/maps/search/wedding+planner+dallas/@37.09024,-95.712891,4z?hl=en&gl=US&uule=w+CAIQIFISCQs2MuSEtepUEUK33kOSuTsc",
      "datetime": "2025-01-23 02:27:34 +00:00",
      "spell": null,
      "refinement_chips": null,
      "item_types": [
        "maps_search"
      ],
      "se_results_count": 0,
      "items_count": 10,
      "items": [
        {
          "type": "maps_search",
          "rank_group": 1,
          "rank_absolute": 1,
          "domain": "www.doubleblessingevents.com",
          "title": "Double Blessing Events LLC",
          "url": "http://www.doubleblessingevents.com/",
          "contact_url": "https://doubleblessingevents.hbportal.co/schedule/5e90d11b6fc3ff0b613140d8",
          "contributor_url": "https://maps.google.com/maps/contrib/116506541795915789719",
          "book_online_url": null,
          "rating": {
            "rating_type": "Max5",
            "value": 5,
            "votes_count": 85,
            "rating_max": null
          },
          "hotel_rating": null,
          "price_level": null,
          "rating_distribution": {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 2,
            "5": 83
          },
          "snippet": "350 North St. Paul Street, Dallas, TX 75201",
          "address": "350 North St. Paul Street, Dallas, TX 75201",
          "address_info": {
            "borough": "City Center District",
            "address": "350 North St. Paul Street",
            "city": "Dallas",
            "zip": "75201",
            "region": "Texas",
            "country_code": "US"
          },
          "place_id": "ChIJ8TAU85cfTIYRNZQm6_1_xxc",
          "phone": "+1214-755-4367",
          "main_image": "https://lh5.googleusercontent.com/p/AF1QipP401NwDBY_l3UDFBbYnmNugsjNA10caRrKITSq=w408-h272-k-no",
          "total_photos": 129,
          "category": "Wedding planner",
          "additional_categories": null,
          "category_ids": [
            "wedding_planner"
          ],
          "work_hours": {
            "timetable": {
              "sunday": [
                {
                  "open": {
                    "hour": 0,
                    "minute": 0
                  },
                  "close": {
                    "hour": 0,
                    "minute": 0
                  }
                }
              ],
              "monday": [
                {
                  "open": {
                    "hour": 0,
                    "minute": 0
                  },
                  "close": {
                    "hour": 0,
                    "minute": 0
                  }
                }
              ],
              "tuesday": [
                {
                  "open": {
                    "hour": 0,
                    "minute": 0
                  },
                  "close": {
                    "hour": 0,
                    "minute": 0
                  }
                }
              ],
              "wednesday": [
                {
                  "open": {
                    "hour": 0,
                    "minute": 0
                  },
                  "close": {
                    "hour": 0,
                    "minute": 0
                  }
                }
              ],
              "thursday": [
                {
                  "open": {
                    "hour": 0,
                    "minute": 0
                  },
                  "close": {
                    "hour": 0,
                    "minute": 0
                  }
                }
              ],
              "friday": [
                {
                  "open": {
                    "hour": 0,
                    "minute": 0
                  },
                  "close": {
                    "hour": 0,
                    "minute": 0
                  }
                }
              ],
              "saturday": [
                {
                  "open": {
                    "hour": 0,
                    "minute": 0
                  },
                  "close": {
                    "hour": 0,
                    "minute": 0
                  }
                }
              ]
            },
            "current_status": "open"
          },
          "feature_id": "0x864c1f97f31430f1:0x17c77ffdeb269435",
          "cid": "1713478911786390581",
          "latitude": 32.7839907,
          "longitude": -96.7968614,
          "is_claimed": true,
          "local_justifications": null,
          "is_directory_item": false
        },
        {
