package it.lab15.dashup.jmx.sample;

import java.io.IOException;

import javax.management.MBeanServerConnection;

import it.lab15.dashup.jmx.common.JmxUtils;
import it.lab15.dashup.jmx.monitor.CPULoadMonitor;
import it.lab15.dashup.jmx.monitor.MemoryLoadMonitor;

public class SimpleJMXMonitor extends Thread {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		new SimpleJMXMonitor("localhost",1234).start();
	}

	String host;
	int port;
	MBeanServerConnection remote;
	CPULoadMonitor cpuMonitor;
	MemoryLoadMonitor memMonitor;
	
	public SimpleJMXMonitor(String host, int port){
		this.host = host;
		this.port = port;
	}
	
	public void run(){
		try {
			remote = JmxUtils.getRemoteConnection(host, port);
			cpuMonitor = new CPULoadMonitor();
			cpuMonitor.initialize(remote);
			
			memMonitor = new MemoryLoadMonitor();
			memMonitor.initialize(remote);
			
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		while(true){
			try {
				System.out.println("CPU load: " + cpuMonitor.toJSON());
				System.out.println("Mem load: " + memMonitor.toJSON());
				sleep(1000);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	
}
