package de.tetet.fof7.config;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.GnuParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.OptionBuilder;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.yaml.snakeyaml.Yaml;

/**
 * Deliver a configuration
 * @author spindler
 *
 */
public final class ConfigFactory {
	private static final Logger LOG = LoggerFactory.getLogger(ConfigFactory.class);
	private static final String FILE = "file";
	private static final String OPT_HELP = "help";

	private static Config cfg;

	/**
	 * Default constructor
	 */
	private ConfigFactory() {

	}

	/**
	 * @return the configuration
	 */
	public static Config getConfig() {
		if (cfg == null) {
			cfg = new Config();
		}
		return cfg;
	}

	/**
	 * @param config sets the config
	 */
	public static void setConfig(Config config) {
		cfg = config;
	}

	/**
	 * Set config from file
	 * @param file is the filename
	 * @return the config
	 */
	public static Config fromFile(String file) {
		Yaml yaml = new Yaml();
		try {
			InputStream in = Files.newInputStream( Paths.get(file) );
			cfg = yaml.loadAs(in, Config.class);
			return cfg;
		} catch (IOException e) {
			LOG.error("Error reading config", e);
		}
		cfg = new Config();
		return cfg;
	}

	@SuppressWarnings("static-access")
	public static Boolean parseArgs(String[] args, String appname) {
		CommandLineParser parser = new GnuParser();
	
		// create the Options
		Options options = new Options();
		options.addOption(
				OptionBuilder.withLongOpt( OPT_HELP )
				.withDescription( "Show help mesage" )
				.create());
		options.addOption(
				OptionBuilder.withLongOpt(FILE)
				.withDescription("Config file for update fof7 league")
				.hasArg()
				.withArgName("FILE")
				.create());
		CommandLine line;
		try {
			line = parser.parse( options, args );
	        if (line.hasOption(OPT_HELP)) {
	            HelpFormatter formatter = new HelpFormatter();
	            formatter.printHelp( appname, options );
	            return false;
	        }
			if (line.hasOption(FILE)) {
				fromFile(line.getOptionValue(FILE));
			}
		} catch (ParseException e) {
			LOG.error("error parsing command line, use --help", e);
		}
		return true;
	}

}
