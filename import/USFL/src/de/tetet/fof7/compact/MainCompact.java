package de.tetet.fof7.compact;

import com.google.common.base.Objects;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBObject;

import de.tetet.fof7.config.Config;
import de.tetet.fof7.config.ConfigFactory;
import de.tetet.mongodb.MongoDBConn;

/**
 * Compact the given database, remove all fields that are 0
 * @author spindler
 *
 */
public final class MainCompact {
	private static final String APPNAME = "MainCompact";
	private DB db;
	
	/**
	 * Default constructor
	 */
	public MainCompact() {
		
	}
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		if (ConfigFactory.parseArgs(args, APPNAME)) {
			new MainCompact().compact();
		}
	}

	/**
	 * iterate over all collections in the database and compact them
	 * @return the object
	 */
	public MainCompact compact() {
		Config cfg = ConfigFactory.getConfig();
		db = new MongoDBConn().connect(cfg.getDbname());
		for (String collection: db.getCollectionNames()) {
			if (!Objects.equal("system.indexes", collection)) {
				compact(collection);
			}
		}
		return this;
	}

	/**
	 * Note: only works when the first object found still has "0" values for its keys
	 * E.g. a previously compacted collection won't most likely be not compacted again
	 * @param collection is being compacted, all "0" value keys are removed
	 * @return the object
	 */
	public MainCompact compact(String collection) {
		DBObject sample = db.getCollection(collection).findOne();
		
		for (String key: sample.keySet()) {
			if (Objects.equal("_id", key)) {
				continue;
			}
			System.out.println(collection + " has " + key);
			BasicDBObject query = new BasicDBObject(key, "0");
			BasicDBObject update = new BasicDBObject("$unset", new BasicDBObject(key, true));
			db.getCollection(collection).update(query, update, false, true);
		}
		
		return this;
	}

}
