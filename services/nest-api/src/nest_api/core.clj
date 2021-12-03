(ns nest-api.core
  (:require [compojure.core :refer :all]
            [clojure.tools.logging :refer :all]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]
            [org.httpkit.server :as http]
            [next.jdbc.result-set :as rs]
            [clojure.data.json :as json]
            [next.jdbc :as jdbc])
  (:gen-class))

(def db {
         :dbtype   "mysql"
         :dbname   "iot"
         :user     "root"
         :password "helloworld"
         :host     "localhost"
         :port     3306
         })
(def ds (jdbc/get-datasource db))

(defn get-sensor-data [ds]
  (jdbc/execute! ds ["SELECT * FROM temperature_and_humidity
                      WHERE TO_DAYS(datetime) = TO_DAYS(NOW())
                      ORDER BY datetime DESC"]
                 {:builder-fn rs/as-unqualified-lower-maps}))

(defroutes app-routes
           (GET "/dht" req {:body    (json/write-str (get-sensor-data ds))
                           :headers {"content-type" "application/json"}}))
(def app
  (wrap-defaults app-routes site-defaults))

(defn -main
  "I don't do a whole lot ... yet."
  [& args]
  (let [port (try
               (Integer/parseInt (first args))
               (catch Exception _ 3002))]
    (http/run-server app {:port port})
    (info "Server started on port" port)))
