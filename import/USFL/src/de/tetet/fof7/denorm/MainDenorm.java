package de.tetet.fof7.denorm;

import de.tetet.fof7.config.ConfigFactory;

/**
 * Denormalize fof7 data for mongodb usage
 * @author spindler
 *
 */
public class MainDenorm {

	private static final String APPNAME = "MainDenorm";

	/**
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		if (ConfigFactory.parseArgs(args, APPNAME)) {
			new Ratings().combine();
			new Seasons().combine();
		}

	}

}
