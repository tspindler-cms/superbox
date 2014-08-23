package de.tetet.fof7.denorm;


public class Seasons {
	private String base = "player_season_";
	private String result = "seasons";
	
	/**
	 * Default constructor
	 */
	public Seasons() {
		
	}
	
	/**
	 * Combine player_season_ collections into seasons collection
	 * @return the object
	 */
	public Seasons combine() {
		new Combiner().base(base).result(result).combine();
		return this;
	}

}
