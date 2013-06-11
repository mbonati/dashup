package it.lab15.dashup.jmx.core;

import static org.junit.Assert.*;

import org.apache.commons.configuration.HierarchicalConfiguration;
import org.junit.Test;

public class ConfigurationManagerTest extends BaseTest {
	
	
	@Test
	public void testLoad(){
		ConfigurationManager.getInstance();
		assertTrue(ConfigurationManager.getInstance().isValid());
	}

	@Test
	public void testGetApplicationsList(){
		int appCount = ConfigurationManager.getInstance().getApplicationsCount();
		assertTrue(appCount==2);
	}
	
	@Test
	public void testGetAppConfig(){
		String appId = ConfigurationManager.getInstance().getApplicationId(0);
		assertEquals("Test Application", appId);
		
		HierarchicalConfiguration appCfg = ConfigurationManager.getInstance().getApplicationConfig(0);
		assertTrue(appCfg!=null);
		
		String host = appCfg.getString("jmx[@host]");
		assertEquals("localhost", host);

		long port = appCfg.getLong("jmx[@port]");
		assertEquals(12345, port);

		
	}
	
}
