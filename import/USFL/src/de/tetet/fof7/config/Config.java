package de.tetet.fof7.config;

import com.google.common.base.Objects;

/**
 * Configuration class
 * @author spindler
 *
 */
public class Config {
	private static final String DIRECTORY = "/Users/spindler/shared/USFL/1234USFL";
	private static final String CSV = "player_season_2035.csv";	
	private static final String COLL = "seasons";
	private static final String TMPCOLL = "season2035";
	private static final String DBNAME = "football";

	private String dbname;
	private String tmpcoll;
	private String coll;
	private String csv;
	private String directory;

	/**
	 * Default constructor
	 */
	public Config() {
		dbname = DBNAME;
		directory = DIRECTORY;
		csv = CSV;
		coll = COLL;
		tmpcoll = TMPCOLL;
	}
	
	/**
	 * @return the configured database name
	 */
	public String getDbname() {
		return dbname;
	}

	/**
	 * @param dbname is a database name
	 */
	public void setDbname(String dbname) {
		this.dbname = dbname;
	}
	
	/**
	 * @return the temporary collection
	 */
	public String getTmpcoll() {
		return tmpcoll;
	}

	/**
	 * @param tmpcoll sets the temporary collection
	 */
	public void setTmpcoll(String tmpcoll) {
		this.tmpcoll = tmpcoll;
	}

	/**
	 * @return the collection
	 */
	public String getColl() {
		return coll;
	}

	/**
	 * @param coll sets the collection
	 */
	public void setColl(String coll) {
		this.coll = coll;
	}

	/**
	 * @return the csv file to be used
	 */
	public String getCsv() {
		return csv;
	}

	/**
	 * @param csv set the csv file that is imported
	 */
	public void setCsv(String csv) {
		this.csv = csv;
	}

	/**
	 * @return the directory in which the csv file resides
	 */
	public String getDirectory() {
		return directory;
	}

	/**
	 * @param directory set the directory in which csv file is looked for
	 */
	public void setDirectory(String directory) {
		this.directory = directory;
	}

	@Override
	public String toString() {
		return Objects.toStringHelper(Config.class)
				.omitNullValues()
				.add("dbname", dbname)
				.add("tmpcoll", tmpcoll)
				.add("coll", coll)
				.add("csv", csv)
				.add("directory", directory)
				.toString();
	}
}
