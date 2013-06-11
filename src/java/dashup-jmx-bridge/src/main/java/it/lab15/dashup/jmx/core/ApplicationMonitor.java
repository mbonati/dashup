package it.lab15.dashup.jmx.core;

import it.lab15.dashup.client.rest.RESTClient;
import it.lab15.dashup.jmx.ApplicationMonitorEngine;
import it.lab15.dashup.jmx.common.JmxUtils;
import it.lab15.dashup.jmx.core.JmxConnector.JmxConnectorListener;
import it.lab15.dashup.jmx.monitor.DashupMonitorable;

import java.util.ArrayList;
import java.util.List;

import javax.management.MBeanServerConnection;

import org.apache.commons.configuration.HierarchicalConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ApplicationMonitor {

	private static final Logger LOG = LoggerFactory.getLogger(ApplicationMonitor.class);

	HierarchicalConfiguration appConfig;
	MonitorManager monitorManager;
	List<DashupMonitorable> monitorables = new ArrayList<DashupMonitorable>(); 
	String jmxHost;
	int jmxPort;
	private MBeanServerConnection jmxRemoteConnection;
	private JmxConnector jmxConnector;
	RESTClient restClient = new RESTClient();

	public ApplicationMonitor(HierarchicalConfiguration appConfig){
		LOG.info("Initializing monitor daemon for {}", appConfig.getString("[@id]"));
		this.appConfig = appConfig;
		monitorManager = ApplicationMonitorEngine.getInstance().getMonitorManager();
	}
	
	public ApplicationMonitor setup() throws Exception {
		LOG.info("Setup monitor daemon for {}", getApplicationId());
		
		//get jmx parameters
		jmxHost = appConfig.getString("jmx[@host]");
		jmxPort = appConfig.getInt("jmx[@port]");
		LOG.debug("JMX params for {}: host={} port={}", new Object[]{ getApplicationId(), jmxHost, jmxPort} );
		
		List<String> exports = getStringList("jmx.exports.export[@type]");
		for (String export:exports){
			LOG.debug("loading export {}", export);
			DashupMonitorable monitorable = monitorManager.createMonitor(export);
			monitorables.add(monitorable);
			LOG.debug("export {} loaded", export);
		}
		LOG.info("Monitor daemon for {} is ready", getApplicationId());
		return this;
	}
	
	public ApplicationMonitor start() throws Exception {
		LOG.info("Starting monitor daemon for {}", getApplicationId());
		
		LOG.debug("Connecting jmx monitor daemon to {}:{}...", jmxHost, jmxPort);
		jmxConnector = new JmxConnector(jmxHost, jmxPort, true, new JmxConnectorListener() {
			@Override
			public void onJmxDisconnection(MBeanServerConnection connection) {
				stopMonitoring(connection);
			}
			@Override
			public void onJmxConnection(MBeanServerConnection connection) {
				startMonitoring(connection);
			}
		});
		jmxConnector.start();
		
		LOG.info("Monitor daemon for {} is started", getApplicationId());
		return this;
	}

	private void stopMonitoring(MBeanServerConnection connection) {
		// TODO Auto-generated method stub
	}

	private void startMonitoring(MBeanServerConnection connection) {
		LOG.debug("startMonitoring called");
		try {
			this.jmxRemoteConnection = connection;
			LOG.debug("jmx monitor daemon connected to {}:{}", jmxHost, jmxPort);
			
			
			LOG.debug("Setting up monitorables...", jmxHost, jmxPort);
			for (DashupMonitorable monitorable:monitorables){
				try {
					monitorable.setup(jmxRemoteConnection);
				} catch (Exception ex){
					LOG.error("Erro setting up monitorable: {}",ex.getMessage(), ex);
				}
			}
			
			
			//REST connection to Dashup
			if (!restClient.isConnected()){
				String restURL = ConfigurationManager.getInstance().getConfiguration().getString("dashup.rest[@url]");
				LOG.debug("Connecting jmx monitor daemon to Dashup REST interface {}...", restURL);
				restClient.connect(restURL);
				LOG.debug("jmx monitor daemon conneted to Dashup REST interface {}...", restURL);
			}
			
		} catch (Exception ex){
			LOG.error("Error starting monitoring: {}", ex.getMessage(), ex);
		}
	}

	
	public ApplicationMonitor shutdown(){
		LOG.info("Shutting down monitor daemon for {}", getApplicationId());
		//TODO!!
		LOG.info("Monitor daemon for {} is stopped", getApplicationId());
		return this;
	}
	
	public String getApplicationId(){
		return appConfig.getString("[@id]");
	}
	
	private List<String> getStringList(String key){
		List retRaw = appConfig.getList(key);
		return (List<String>)retRaw;
	}
	
}
