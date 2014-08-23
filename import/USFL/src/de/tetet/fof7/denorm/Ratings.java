package de.tetet.fof7.denorm;


/**
 * Denormalize player ratings
 * @author spindler
 *
 */
public class Ratings {
	private final String result = "ratings";
	private final String base  = "player_ratings_season_";
	
	/**
	 * Combine player_ratings_season_ into ratings
	 * @return the object
	 */
	public Ratings combine() {
		new Combiner().base(base).result(result).combine();
		return this;
	}

}
