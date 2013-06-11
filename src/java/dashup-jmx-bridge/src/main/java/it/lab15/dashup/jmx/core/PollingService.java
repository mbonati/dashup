package it.lab15.dashup.jmx.core;

import java.util.Timer;
import java.util.TimerTask;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PollingService {
	
	private static final Logger LOG = LoggerFactory.getLogger(PollingService.class);
	
	private Timer pollingTimer;
	private PollingServiceListener listener;
	private long pollingDelay;
	public static final long DEFAULT_POLLING_DELAY = 5000;
	
	public PollingService(long pollingDelay, PollingServiceListener listener){
		this.pollingDelay = pollingDelay;
		this.listener = listener;
		LOG.debug("Created with pollingDelay={}", pollingDelay);
	}
	
	public PollingService(PollingServiceListener listener){
		this(DEFAULT_POLLING_DELAY, listener);
	}
	
	public void start(){
		LOG.debug("Starting with pollingDelay={}", pollingDelay);
		stop();
		PollingServiceTask pollingTask = new PollingServiceTask();
		pollingTimer = new Timer();
		pollingTimer.scheduleAtFixedRate(pollingTask, 0, pollingDelay);
	}
	
	public void stop(){
		if (pollingTimer!=null){
			LOG.debug("Stopping with pollingDelay={}", pollingDelay);
			pollingTimer.cancel();
			pollingTimer = null;
		}
	}
	
	private void doPoll(){
		try {
			listener.onPoll();
		} catch (Throwable th){
			
		}
	}
	
	public interface PollingServiceListener {
		public void onPoll();
	}
	
	private class PollingServiceTask extends TimerTask {
		@Override
		public void run() {
			doPoll();
		}
	}

	public long getPollingDelay() {
		return pollingDelay;
	}

	public void setPollingDelay(long pollingDelay) {
		this.pollingDelay = pollingDelay;
	}
	
	
	
}
