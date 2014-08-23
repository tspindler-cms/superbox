package de.tetet.fof7.usfl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;

import de.tetet.fof7.config.Config;
import de.tetet.fof7.config.ConfigFactory;
import de.tetet.mongodb.MongoDBConn;

/**
 * Store the csv data as json
 * @author spindler
 *
 */
public class StoreJson {
	private static final Logger LOG = LoggerFactory.getLogger(StoreJson.class);
	private String coll;

	/**
	 * @param coll is a collection
	 * @return the StoreJSON object
	 */
	public StoreJson coll(String coll) {
		this.coll = coll;
		return this;
	}

	/**
	 * Save arr to previously set collection, derive field names from heading, field values from arr
	 * @param arr is the payload that is saved
	 * @param heading is the heading for the payload, e.g. the field names (key names)
	 * @return the StoreJson object
	 */
	public StoreJson save(String[] arr, String[] heading, Integer line) {
		Config cfg = ConfigFactory.getConfig();
		DB db = new MongoDBConn().connect(cfg.getDbname());
		if (coll != null) {
			DBObject obj = new BasicDBObject("line", line);
			for (int i = 0; i < arr.length; i++) {
				obj.put(heading[i], arr[i]);			
			}
			DBCollection collection = db.getCollection(coll);
			collection.insert(obj);
		} else {
			LOG.error("No collection set");
		}
		return this;
	}

}
