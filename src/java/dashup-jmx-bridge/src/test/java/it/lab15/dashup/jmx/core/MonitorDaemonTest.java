package it.lab15.dashup.jmx.core;

import static org.junit.Assert.*;

import org.apache.commons.configuration.HierarchicalConfiguration;
import org.junit.Test;

public class MonitorDaemonTest extends BaseTest {

	@Test
	public void testSetup() throws Exception{
		HierarchicalConfiguration appCfg =  ConfigurationManager.getInstance().getApplicationConfig(0);
		ApplicationMonitor monDaemon = new ApplicationMonitor(appCfg);
		assertEquals(monDaemon.getApplicationId(), ConfigurationManager.getInstance().getApplicationId(0));

		monDaemon.setup();
	}
	
}
