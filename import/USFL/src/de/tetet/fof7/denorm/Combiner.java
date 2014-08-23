package de.tetet.fof7.denorm;

import java.util.function.Consumer;
import java.util.function.Predicate;

import com.mongodb.BasicDBObject;
import com.mongodb.BulkWriteOperation;
import com.mongodb.DB;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

import de.tetet.fof7.config.Config;
import de.tetet.fof7.config.ConfigFactory;
import de.tetet.mongodb.MongoDBConn;

public class Combiner {
	
	private final String yearField = "sbYear";
	private String base;
	private String result;
	private DB db;

	/**
	 * Default constructor
	 */
	public Combiner() {
		initdb();
	}
	
	private void initdb() {
		Config cfg = ConfigFactory.getConfig();
		db = new MongoDBConn().connect(cfg.getDbname());
	}
	
	/**
	 * @param base
	 * @return the object
	 */
	public Combiner base(String base) {
		this.base = base;
		return this;
	}
	
	/**
	 * @param result
	 * @return the object
	 */
	public Combiner result(String result) {
		this.result = result;
		return this;
	}
	
	/**
	 * 
	 */
	public void combine() {
		Predicate<String> isSeasons = new Predicate<String>() {

			@Override
			public boolean test(String t) {
				return t.startsWith(base);
			}
			
		};
		Consumer<String> combine = new Consumer<String>() {

			@Override
			public void accept(String t) {
				combine(t);				
			}
			
		};
//		db.getCollection(result).drop();
		db.getCollectionNames().stream().filter(isSeasons).forEach(combine);
	}


	/**
	 * @param collection is stored in result
	 */
	private void combine(String collection) {
		String year = getYear(collection);
		DBObject update = new BasicDBObject("$set", new BasicDBObject(yearField, year));
		DBObject query = new BasicDBObject();
		db.getCollection(collection).update(query, update, false, true);
		
		BulkWriteOperation builder = db.getCollection(result).initializeUnorderedBulkOperation();
		
		DBCursor cursor = db.getCollection(collection).find();
		while (cursor.hasNext()) {
			DBObject o = cursor.next();
			builder.insert(o);
		}
		
		builder.execute();
		db.getCollection(collection).drop();
	}

	/**
	 * @param collection
	 * @return the year for the collection
	 */
	private String getYear(String collection) {
		return collection.replace(base, "");
	}


}
