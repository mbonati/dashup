package it.lab15.dashup.jmx.core;

import java.io.File;
import java.util.List;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.HierarchicalConfiguration;
import org.apache.commons.configuration.XMLConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ConfigurationManager {

	private static Logger LOG = LoggerFactory.getLogger(ConfigurationManager.class);
	
	private static ConfigurationManager instance;

	public static String CONFIG_FILE_PROPERTY = "configFile";
	
	private static final String DEFAULT_CONFIG_FILE = "config/dashup.appmonitor.xml";
	private String configFile;
	private XMLConfiguration config;

	private ConfigurationManager() {
		loadConfiguration();
	}

	private void loadConfiguration() {

		// Load configuration
		configFile = System.getProperty(CONFIG_FILE_PROPERTY, DEFAULT_CONFIG_FILE);
		LOG.debug("Loading configuration file {}", configFile);

		try {
			config = new XMLConfiguration(configFile);
			LOG.debug("Configuration file loaded successfully");
		} catch (ConfigurationException cex) {
			LOG.error("error: {}", cex.getMessage(), cex);
		}

	}
	
	public boolean isValid(){
		return (config!=null);
	}
	
	public static ConfigurationManager getInstance() {
		if (instance == null) {
			instance = new ConfigurationManager();
		}
		return instance;
	}

	public int getApplicationsCount() {
		return getApplications().size();
	}

	public List<String> getApplications(){
		List applications = config.getList("applications.application[@id]");
		return (List<String>)applications;	
	}

	public String getApplicationId(int index) {
		return getApplications().get(index);
	}
	
	public XMLConfiguration getConfiguration(){
		return this.config;
	}

	public HierarchicalConfiguration getApplicationConfig(int index) {
		return this.config.configurationAt("applications.application("+index+")");
	}


	
}
