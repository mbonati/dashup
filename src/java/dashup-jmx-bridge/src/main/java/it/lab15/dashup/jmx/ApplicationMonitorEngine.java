
package it.lab15.dashup.jmx;

import it.lab15.dashup.jmx.core.ApplicationMonitor;
import it.lab15.dashup.jmx.core.ConfigurationManager;
import it.lab15.dashup.jmx.core.MonitorManager;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.configuration.HierarchicalConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class ApplicationMonitorEngine {

	private static final Logger LOG = LoggerFactory.getLogger(ApplicationMonitorEngine.class);
	
	MonitorManager monitorManager;
	private Map<String, ApplicationMonitor> appMonDaemons = new HashMap<String, ApplicationMonitor>();
	
	private static ApplicationMonitorEngine instance;
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		LOG.info("Starting Dashup JMX Application Monitor...");
		new ApplicationMonitorEngine(args).start();
	}
	
	
	private ApplicationMonitorEngine(String[] args) {
		LOG.info("init...");
		instance = this;
	}
	
	public static ApplicationMonitorEngine getInstance(){
		return instance;
	}
	
	private void start(){
		LOG.info("start...");

		LOG.info("Initializing the Monitor Manager...");
		monitorManager = new MonitorManager();
		try {
			monitorManager.initialize();
		} catch (Exception e) {
			LOG.error("Error initializing the Monitor Manager: {}", e.getMessage(), e);
		}
		
		//Load the monitor daemons
		LOG.info("Loading the application monitor daemons...");
		List<String> appIds = ConfigurationManager.getInstance().getApplications();
		if (appIds!=null){
			int applicationCount = appIds.size();
			for(int i=0;i<applicationCount;i++){
				try {
					HierarchicalConfiguration appConfig = ConfigurationManager.getInstance().getApplicationConfig(i);
					ApplicationMonitor appMon = new ApplicationMonitor(appConfig).setup();
					appMonDaemons.put(appMon.getApplicationId(), appMon);
				} catch (Exception ex){
					LOG.error("Error initializing application monitor daemon: {}", ex.getMessage(), ex);
				}
			}
			LOG.info("Loaded {} application monitor daemons", appMonDaemons.size());
		} else {
			LOG.info("No applications defined.");
		}

		//Start the loaded daemons
		LOG.info("Starting the application monitor daemons...");
		Collection<ApplicationMonitor> loadedDaemons = appMonDaemons.values();
		int startedCount = 0;
		for (ApplicationMonitor daemon:loadedDaemons){
			try {
				daemon.start();
				startedCount++;
			} catch (Exception e) {
				LOG.error("Error starting application monitor daemon: {}", new Object [] { daemon.getApplicationId(), e.getMessage(), e });
			}
		}
		LOG.info("Started {} application monitor daemon/s...", startedCount);
		
	}
	
	public MonitorManager getMonitorManager(){
		return monitorManager;
	}
	
	
}
