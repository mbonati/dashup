package it.lab15.dashup.jmx.core;

import java.net.URL;

import org.junit.Before;

public class BaseTest {
	
	@Before
	public void init(){
		URL configFileURL = this.getClass().getResource("/dashup.appmonitor.test.xml");
		System.setProperty(ConfigurationManager.CONFIG_FILE_PROPERTY, configFileURL.getFile());
	}
	
}
