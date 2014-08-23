package de.tetet.mongodb;

import java.net.UnknownHostException;

import com.mongodb.DB;
import com.mongodb.MongoClient;

/**
 * Basic class for connecting to mongodb
 * @author spindler
 *
 */
public final class MongoDBConn {
	
	private static DB db;
	
	/**
	 * @param dbname is a mongodb database name
	 * @return a db connection for 'dbname'
	 */
	public DB connect(String dbname) {
		if (db == null) {
			try {
				MongoClient m = new MongoClient();
				db = m.getDB(dbname);
			} catch (UnknownHostException e) {
				e.printStackTrace();
			}
		}
		return db;
	}

}
