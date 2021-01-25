//
//  RCTBeaconModule.m
//  barenative
//
//  Created by Art Navsegda on 08.01.2021.
//

#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import <CoreLocation/CoreLocation.h>
#import "RCTBeaconModule.h"

@interface RCTBeaconModule() <CLLocationManagerDelegate>

@property (strong, nonatomic) CLBeaconRegion *myBeaconRegion;
@property (strong, nonatomic) CLLocationManager *locationManager;

@end

@implementation RCTBeaconModule
{
  bool hasListeners;
}

// Will be called when this module's first listener is added.
-(void)startObserving {
    hasListeners = YES;
    // Set up any upstream listeners or background tasks as necessary
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasListeners = NO;
    // Remove upstream listeners, stop unnecessary background tasks
}

// To export a module named RCTCalendarModule
RCT_EXPORT_MODULE();

- (instancetype)init
{
  if (self = [super init]) {
    self.locationManager = [[CLLocationManager alloc] init];
    self.locationManager.delegate = self;
    [self.locationManager requestWhenInUseAuthorization];
  }

  return self;
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[
             @"EventBeacon"
             ];
}

RCT_EXPORT_METHOD(startRangingBeaconsInRegion:(NSString *)uuidString)
{
  NSUUID *uuid = [[NSUUID alloc] initWithUUIDString:uuidString];
  self.myBeaconRegion = [[CLBeaconRegion alloc] initWithProximityUUID:uuid identifier:@"art.navsegda.testregion"];
  [self.locationManager startRangingBeaconsInRegion:self.myBeaconRegion];
}

RCT_EXPORT_METHOD(stopRangingBeaconsInRegion)
{
  [self.locationManager stopRangingBeaconsInRegion:self.myBeaconRegion];
}

-(void)locationManager:(CLLocationManager*)manager
       didRangeBeacons:(NSArray*)beacons
              inRegion:(CLBeaconRegion*)region
{
  CLBeacon *foundBeacon = [beacons firstObject];
  NSString *uuid = foundBeacon.proximityUUID.UUIDString;
  //NSLog(@"UUID: %@", uuid);
  
  if (uuid && hasListeners) { // Only send events if anyone is listening
    [self sendEventWithName:@"EventBeacon" body:@{@"name": uuid}];
  }
}

@end
