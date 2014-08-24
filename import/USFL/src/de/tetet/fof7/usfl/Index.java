package de.tetet.fof7.usfl;

import com.google.common.base.Objects;
import com.google.common.collect.ImmutableList;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBObject;

import de.tetet.fof7.config.Config;
import de.tetet.fof7.config.ConfigFactory;
import de.tetet.mongodb.MongoDBConn;

/**
 * Add indexes to database
 * @author spindler
 *
 */
public class Index {

	private static final String SEASONS = "seasons";

	/**
	 * Create the indexes
	 */
	public void create() {
		Config cfg = ConfigFactory.getConfig();
		DB db = new MongoDBConn().connect(cfg.getDbname());
		DBObject playerId = new BasicDBObject("Player_ID", 1);
		for (String coll: db.getCollectionNames()) {
			if (!Objects.equal("system.indexes", coll)) {
				db.getCollection(coll).createIndex(playerId);
			}
		}
		for (String field: ImmutableList.of("Week", "Year")) {
			DBObject fieldObj = new BasicDBObject(field, 1);
			db.getCollection(SEASONS).createIndex(fieldObj);
		}
	}

}
