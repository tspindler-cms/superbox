package de.tetet.fof7.usfl;

import java.io.FileReader;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Predicate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import au.com.bytecode.opencsv.CSVReader;
import de.tetet.fof7.config.Config;
import de.tetet.fof7.config.ConfigFactory;

/**
 * Main entrance 
 * @author spindler
 *
 */
public final class MainCSV {
	private static final Logger LOG = LoggerFactory.getLogger(MainCSV.class);
	private static final String SUFFIX = "csv";
	private static final String APPNAME = "MainCSV";

	/**
	 * Read the csv files and store them in mongodb
	 * @param args
	 */
	public static void main(String[] args) {
		if (ConfigFactory.parseArgs(args, APPNAME)) {
			new MainCSV().saveCSV();
		}
	}

	/**
	 * Take the csv files and store them in mongodb
	 */
	private void saveCSV() {
		Config cfg = ConfigFactory.getConfig();
		String dir = cfg.getDirectory();
		Path path = FileSystems.getDefault().getPath(dir);

		try {
			Predicate<Path> fileending = new Predicate<Path>() {
				@Override
				public boolean test(Path t) {
					if (t.toString().endsWith(SUFFIX)) {
						return true;
					}
					return false;
				}
			};
			Consumer<? super Path> save = new Consumer<Path>() {
				private CSVReader reader;
				private String[] headings;

				@Override
				public void accept(Path t) {
					try {
						final String collname = com.google.common.io.Files.getNameWithoutExtension(t.getFileName().toString());
						reader = new CSVReader(new FileReader(t.toString()));
						LOG.info("Saving {} in {}", t, collname);
						List<String[]> list = reader.readAll();
						int i = 0;
						for (String[] arr: list) {
							if (i == 0) {
								headings = arr;
							} else {
								new StoreJson().coll(collname).save(arr, headings, i);
							}
							i++;
						}
					} catch (IOException e) {
						LOG.error("accept on path", e);
					} 
				}				
			};
			Files.list(path).filter(fileending).forEach(save);
		} catch (IOException e) {
			LOG.error("convert", e);
		}
	}
}
