(defproject nest-api "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "EPL-2.0 OR GPL-2.0-or-later WITH Classpath-exception-2.0"
            :url  "https://www.eclipse.org/legal/epl-2.0/"}
  :dependencies [[org.clojure/clojure "1.10.3"]
                 [org.clojure/data.json "2.4.0"]
                 [http-kit "2.5.3"]
                 [compojure "1.6.2"]
                 [ring/ring-defaults "0.3.2"]
                 [com.github.seancorfield/next.jdbc "1.2.753"]
                 [org.apache.logging.log4j/log4j-api "2.14.1"]
                 [org.apache.logging.log4j/log4j-core "2.14.1"]
                 [org.apache.logging.log4j/log4j-slf4j-impl "2.14.1"]
                 [mysql/mysql-connector-java "8.0.27"]
                 [org.clojure/tools.logging "1.1.0"]
                 [com.zaxxer/HikariCP "5.0.0"]]
  :main ^:skip-aot nest-api.core
  :target-path "target/%s"
  :profiles {:uberjar {:aot      :all
                       :jvm-opts ["-Dclojure.compiler.direct-linking=true"]}})
