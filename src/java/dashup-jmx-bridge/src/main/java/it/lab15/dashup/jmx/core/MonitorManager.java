package it.lab15.dashup.jmx.core;

import it.lab15.dashup.jmx.monitor.DashupMonitorable;
import it.lab15.dashup.jmx.monitor.Monitorable;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.reflections.Reflections;
import org.reflections.scanners.TypeAnnotationsScanner;
import org.reflections.util.ClasspathHelper;
import org.reflections.util.ConfigurationBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MonitorManager {
	
	private static Logger LOG = LoggerFactory.getLogger(MonitorManager.class);

	// Registered monitor types
	private Map<String, Class> monitorables = new HashMap<String, Class>();
	
	public MonitorManager(){
	}
	
	public void initialize() throws Exception {
		loadMonitorTypes();
	}

	/**
	 * Load built-in monitor types
	 */
	private void loadMonitorTypes() {
		loadMonitorTypes("it.lab15.dashup");
	}
	
	/**
	 * Load the monitors by annotated classes
	 * @param packagePrefix
	 */
	private void loadMonitorTypes(String packagePrefix){
		LOG.info("Loading monitor types for package {}", packagePrefix);
		
		Reflections reflections = new Reflections(new ConfigurationBuilder()
        .addUrls(ClasspathHelper.forPackage(packagePrefix))
        .setScanners(new TypeAnnotationsScanner()));
        
		Set<Class<?>> monitorables =  reflections.getTypesAnnotatedWith(Monitorable.class);
		for (Class clazz:monitorables){
			String type = null;
			try {
				Monitorable annotation = (Monitorable)clazz.getAnnotation(Monitorable.class);
				type = annotation.type();
				LOG.info("Registering monitorable type {}", type);
				registerMonitorType(annotation.type(), clazz);
			} catch (Exception ex){
				LOG.error("Error registering monitorable type {}", type);
			}
		}
	}
	
	/**
	 * Register a monitor class with a given name
	 * @param type
	 * @param clazz
	 * @throws Exception
	 */
	private void registerMonitorType(String type, Class clazz) throws Exception {
		if (monitorables.containsKey(type)){
			throw new Exception("Type '"+ type +"' already registered.");
		}
		monitorables.put(type, clazz);
	}
	
	/**
	 * Create a monitor instance
	 * @param type
	 * @return
	 * @throws Exception
	 */
	public DashupMonitorable createMonitor(String type) throws Exception {
		Class clazz = monitorables.get(type);
		if (clazz==null){
			throw new Exception("Unknown type '"+ type + "'.");
		}
		Object monitorableInstance = clazz.newInstance();
		if (monitorableInstance instanceof DashupMonitorable){
			return (DashupMonitorable)monitorableInstance;
		} else {
			throw new Exception("Monitorable incompatible class for " + monitorableInstance.getClass());
		}
	}
	
}
