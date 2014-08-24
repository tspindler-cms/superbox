package de.tetet.fof7.denorm;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.tetet.fof7.config.ConfigFactory;

/**
 * Denormalize fof7 data for mongodb usage
 * @author spindler
 *
 */
public class MainDenorm {

	private static final String APPNAME = "MainDenorm";
	private static final Logger LOG = LoggerFactory.getLogger(MainDenorm.class);;

	/**
	 * Denormalization, combine several collections into one
	 * @param args
	 */
	public static void main(String[] args) {
		if (ConfigFactory.parseArgs(args, APPNAME)) {
			new MainDenorm().denorm();
		}
	}

	/**
	 * Denormalize the database
	 */
	public void denorm() {
		LOG.info("Combining ratings");
		new Ratings().combine();
		LOG.info("Combining seasons");
		new Seasons().combine();
	}

}
