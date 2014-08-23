package de.tetet.fof7.updateCurrentSeason;

import java.io.FileReader;
import java.io.IOException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import au.com.bytecode.opencsv.CSVReader;

import com.mongodb.BasicDBObject;
import com.mongodb.BulkWriteOperation;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

import de.tetet.fof7.config.Config;
import de.tetet.fof7.config.ConfigFactory;
import de.tetet.fof7.usfl.StoreJson;
import de.tetet.mongodb.MongoDBConn;

/**
 * Update the seasons collection with a new csv
 * Problem is to replace the existing week/playerID combination rather than add them
 * @author spindler
 *
 */
public class MainUpdate {
	private static final String WEEK = "Week";
	private static final String PLAYER_ID = "Player_ID";
	private static final String APPNAME = "MainUpdate";
	private static final Logger LOG = LoggerFactory.getLogger(MainUpdate.class);

	/**
	 * Update the database from csv, merely a single collection (seasons) is affected
	 * @param args
	 * @throws IOException
	 */
	public static void main(String[] args) throws IOException {
		if (ConfigFactory.parseArgs(args, APPNAME)) {
			new MainUpdate().update();			
		}
	}

	/**
	 * Save csv to temporary collection to normalize objects
	 * load objects from temporary collection and update main collection
	 * @throws IOException
	 */
	public void update() throws IOException {
		Config cfg = ConfigFactory.getConfig();
		String[] headings = null;

		LOG.info("Saving {} in {}", cfg.getCsv(), cfg.getColl());
		LOG.info("Cfg: {}", cfg);
		@SuppressWarnings("resource")
		List<String[]> list = new CSVReader(new FileReader(cfg.getDirectory() + "/" + cfg.getCsv())).readAll();
		int i = 0;
		for (String[] arr: list) {
			if (i == 0) {
				headings = arr;
			} else {
				new StoreJson().coll(cfg.getTmpcoll()).save(arr, headings, i);
			}
			i++;
		}

		DB db = new MongoDBConn().connect(cfg.getDbname());
		DBCollection coll = db.getCollection(cfg.getColl());
		BulkWriteOperation builder = coll.initializeUnorderedBulkOperation();

		DBCursor cursor = db.getCollection(cfg.getTmpcoll()).find();
		int j = 0;
		while (cursor.hasNext()) {
			if (1000 == j) {
				j = 0;
				builder.execute();
				builder = coll.initializeUnorderedBulkOperation();
			}
			DBObject obj = cursor.next();
			if (obj.containsField(PLAYER_ID) && obj.containsField(WEEK)) {
				String playerId = (String) obj.get(PLAYER_ID);
				String week = (String) obj.get(WEEK);
				BasicDBObject query = new BasicDBObject(PLAYER_ID, playerId).append(WEEK, week);
				coll.remove(query);
				builder.insert(obj);
			}
			j++;
		}
		builder.execute();
		db.getCollection(cfg.getTmpcoll()).drop();

	}

}
